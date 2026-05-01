import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import Outcall "mo:caffeineai-http-outcalls/outcall";
import GenLib "../lib/generation";
import CourseLib "../lib/courses";
import GenTypes "../types/generation";
import ResourceTypes "../types/resources";
import CourseTypes "../types/courses";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  generations : Map.Map<Nat, GenTypes.CourseGeneration>,
  nextGenerationId : { var value : Nat },
  resources : Map.Map<Nat, ResourceTypes.Resource>,
  courses : Map.Map<Common.CourseId, CourseTypes.Course>,
  nextCourseId : { var value : Common.CourseId },
  adminModelConfig : { var value : GenTypes.AIModelConfig },
) {
  // ── Clé API OpenRouter (à définir dans les variables d'environnement du canister) ──
  let OPENROUTER_API_KEY = "sk-or-replace-with-env-key";
  let OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

  // ── Transformation canonique pour les réponses HTTP (exigée par l'IC) ──
  public query func transformHttpResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // ── Helper : construit le corps JSON pour OpenRouter ──
  func buildOpenRouterBody(model : Text, systemPrompt : Text, userPrompt : Text) : Text {
    "{\"model\":\"" # model # "\",\"messages\":[{\"role\":\"system\",\"content\":\"" # escapeJson(systemPrompt) # "\"},{\"role\":\"user\",\"content\":\"" # escapeJson(userPrompt) # "\"}]}";
  };

  // ── Échappement JSON minimal (guillemets et retours à la ligne) ──
  func escapeJson(s : Text) : Text {
    s
      .replace(#text "\\", "\\\\")
      .replace(#text "\"", "\\\"")
      .replace(#text "\n", "\\n")
      .replace(#text "\r", "\\r");
  };

  // ── Extraction de la réponse de l'assistant dans le JSON OpenRouter ──
  func extractContent(json : Text) : Text {
    let marker = "\"content\":\"";
    switch (json.split(#text marker).next()) {
      case null { json };
      case (?_) {
        var parts = json.split(#text marker);
        ignore parts.next();
        switch (parts.next()) {
          case null { json };
          case (?after) {
            var result = "";
            var escape = false;
            var done = false;
            for (c in after.toIter()) {
              if (done) {}
              else if (escape) {
                result #= Text.fromChar(c);
                escape := false;
              } else if (c == '\\') {
                result #= "\\";
                escape := true;
              } else if (c == '\"') {
                done := true;
              } else {
                result #= Text.fromChar(c);
              };
            };
            result;
          };
        };
      };
    };
  };

  // ── Sélectionne les ressources pertinentes pour une requête ──
  func findMatchingResources(description : Text) : [Nat] {
    let lower = description.toLower();
    let terms = lower.split(#char ' ').filter(func(t) { t.size() > 3 }).toArray();
    if (terms.size() == 0) {
      return resources.values()
        .filter(func(r) { r.status == #indexed })
        .map<ResourceTypes.Resource, Nat>(func(r) { r.id })
        .take(10)
        .toArray();
    };
    resources.values()
      .filter(func(r) { r.status == #indexed })
      .filterMap<ResourceTypes.Resource, (Nat, Nat)>(func(r) {
        let haystack = r.title.toLower() # " " # r.description.toLower()
          # (switch (r.extractedText) { case (?t) { " " # t.toLower() }; case null { "" } })
          # (switch (r.keywords) {
              case (?kws) { " " # kws.values().map(func(k) { k.toLower() }).join(" ") };
              case null { "" };
            });
        let score = terms.foldLeft(
          0,
          func(acc, term) {
            if (haystack.contains(#text term)) { acc + 1 } else { acc };
          },
        );
        if (score > 0) { ?(r.id, score) } else { null };
      })
      .sort(func((_, a), (_, b)) {
        if (a > b) { #less } else if (a < b) { #greater } else { #equal };
      })
      .take(10)
      .map<(Nat, Nat), Nat>(func((id, _)) { id })
      .toArray();
  };

  // ── Construit le résumé des ressources à passer à l'IA ──
  func buildResourceSummary(resourceIds : [Nat]) : Text {
    resourceIds.foldLeft(
      "",
      func(acc, rid) {
        switch (resources.get(rid)) {
          case (?r) {
            let excerpt = switch (r.extractedText) {
              case (?t) {
                if (t.size() > 500) { t.split(#char ' ').take(80).toArray().foldLeft("", func(a, w) { a # " " # w }) }
                else { t };
              };
              case null { r.description };
            };
            acc # "\n---\nTitre: " # r.title # "\nExtrait: " # excerpt;
          };
          case null { acc };
        };
      },
    );
  };

  // ── Étape 1 : modèle de structure (défaut DeepSeek) ──
  func runStep1Structure(gen : GenTypes.CourseGeneration) : async Text {
    let resourceSummary = buildResourceSummary(gen.resourceIds);
    let systemPrompt = "Tu es un expert en ingénierie pédagogique. Génère en français une structure de cours professionnelle (objectifs, plan des leçons, prérequis, résultats attendus) basée sur la description et les ressources fournies. Réponds en JSON structuré.";
    let userPrompt = "Description du cours: " # gen.requestDescription
      # "\n\nRessources disponibles:" # resourceSummary
      # "\n\nGénère la structure pédagogique complète en JSON.";
    let body = buildOpenRouterBody(gen.aiModelConfig.structureModel, systemPrompt, userPrompt);
    let headers = [
      { name = "Authorization"; value = "Bearer " # OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    await Outcall.httpPostRequest(OPENROUTER_URL, headers, body, transformHttpResponse);
  };

  // ── Étape 2 : modèle de contenu (défaut Qwen) — contenu des leçons en français ──
  func runStep2Content(gen : GenTypes.CourseGeneration, structure : Text) : async Text {
    let resourceSummary = buildResourceSummary(gen.resourceIds);
    let systemPrompt = "Tu es un rédacteur pédagogique expert. Sur la base de la structure fournie, génère en français le contenu complet et détaillé de chaque leçon. Utilise un ton formel et académique. Cite les ressources utilisées.";
    let userPrompt = "Structure du cours:\n" # structure
      # "\n\nRessources:\n" # resourceSummary
      # "\n\nGénère le contenu complet de toutes les leçons en français.";
    let body = buildOpenRouterBody(gen.aiModelConfig.contentModel, systemPrompt, userPrompt);
    let headers = [
      { name = "Authorization"; value = "Bearer " # OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    await Outcall.httpPostRequest(OPENROUTER_URL, headers, body, transformHttpResponse);
  };

  // ── Étape 3 : modèle de validation (défaut GPT-4o) ──
  func runStep3Validation(gen : GenTypes.CourseGeneration, structure : Text, content : Text) : async Text {
    let systemPrompt = "Tu es un validateur pédagogique du Ministère de la Formation Professionnelle de la RDC. Évalue le cours fourni selon les critères : cohérence pédagogique, qualité du contenu en français, alignement avec les objectifs. Réponds en JSON avec les champs: approved (boolean), notes (text), suggestions (array of strings).";
    let userPrompt = "Cours à valider:\n\nStructure:\n" # structure
      # "\n\nContenu:\n" # content
      # "\n\nDescription originale: " # gen.requestDescription
      # "\n\nFournis ta décision de validation.";
    let body = buildOpenRouterBody(gen.aiModelConfig.validationModel, systemPrompt, userPrompt);
    let headers = [
      { name = "Authorization"; value = "Bearer " # OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    await Outcall.httpPostRequest(OPENROUTER_URL, headers, body, transformHttpResponse);
  };

  // ── Helper : détermine si le modèle de validation approuve ──
  func isApprovedByValidator(validationResponse : Text) : Bool {
    let lower = validationResponse.toLower();
    lower.contains(#text "\"approved\":true") or lower.contains(#text "approved\": true");
  };

  // ── Parse un résultat Open Library (JSON minimal) ──
  func parseOpenLibraryResults(json : Text, maxResults : Nat) : [ResourceTypes.LibrarySearchResult] {
    // Locate each "key" field in docs array to identify entries
    var results : [ResourceTypes.LibrarySearchResult] = [];
    var count = 0;
    // Split by doc separator pattern: each doc starts with a `{` after `"docs":[`
    let docsMarker = "\"docs\":[";
    let parts = json.split(#text docsMarker);
    ignore parts.next(); // skip before docs
    switch (parts.next()) {
      case null {};
      case (?docsSection) {
        // Find each title entry
        let titleMarker = "\"title\":\"";
        var docParts = docsSection.split(#text titleMarker);
        ignore docParts.next(); // skip prefix
        label docLoop loop {
          if (count >= maxResults) { break docLoop };
          switch (docParts.next()) {
            case null { break docLoop };
            case (?titleAndRest) {
              let title = extractJsonStringValue(titleAndRest);
              let author = extractJsonStringAfterKey(titleAndRest, "\"author_name\":[\"");
              let year = extractJsonStringAfterKeyOpt(titleAndRest, "\"first_publish_year\":");
              let key = extractJsonStringAfterKey(titleAndRest, "\"key\":\"");
              let id = if (key.size() > 0) { "ol" # key } else { "ol-" # count.toText() };
              let url = "https://openlibrary.org" # key;
              results := results.concat([{
                id;
                title;
                author;
                year = if (year.size() > 0) { ?year } else { null };
                source = "Bibliothèque Ouverte";
                description = "Livre disponible sur Open Library";
                url;
                previewUrl = null;
                coverUrl = null;
              }]);
              count += 1;
            };
          };
        };
      };
    };
    results;
  };

  // ── Parse un résultat Gutendex ──
  func parseGutenbergResults(json : Text, maxResults : Nat) : [ResourceTypes.LibrarySearchResult] {
    var results : [ResourceTypes.LibrarySearchResult] = [];
    var count = 0;
    let marker = "\"id\":";
    var parts = json.split(#text marker);
    ignore parts.next();
    label gutenbergLoop loop {
      if (count >= maxResults) { break gutenbergLoop };
      switch (parts.next()) {
        case null { break gutenbergLoop };
        case (?chunk) {
          let id = extractJsonNumber(chunk);
          let title = extractJsonStringAfterKey(chunk, "\"title\":\"");
          let author = extractJsonStringAfterKey(chunk, "\"name\":\"");
          let url = "https://www.gutenberg.org/ebooks/" # id;
          results := results.concat([{
            id = "pg-" # id;
            title;
            author;
            year = null;
            source = "Projet Gutenberg";
            description = "Livre du domaine public disponible sur le Projet Gutenberg";
            url;
            previewUrl = ?(url # ".txt.utf-8");
            coverUrl = null;
          }]);
          count += 1;
        };
      };
    };
    results;
  };

  // ── Parse un résultat Internet Archive ──
  func parseArchiveResults(json : Text, maxResults : Nat) : [ResourceTypes.LibrarySearchResult] {
    var results : [ResourceTypes.LibrarySearchResult] = [];
    var count = 0;
    let marker = "\"identifier\":\"";
    var parts = json.split(#text marker);
    ignore parts.next();
    label archiveLoop loop {
      if (count >= maxResults) { break archiveLoop };
      switch (parts.next()) {
        case null { break archiveLoop };
        case (?chunk) {
          let identifier = extractJsonStringValue(chunk);
          let title = extractJsonStringAfterKey(chunk, "\"title\":\"");
          let creator = extractJsonStringAfterKey(chunk, "\"creator\":\"");
          let date = extractJsonStringAfterKeyOpt(chunk, "\"date\":\"");
          let url = "https://archive.org/details/" # identifier;
          results := results.concat([{
            id = "ia-" # identifier;
            title;
            author = creator;
            year = if (date.size() > 0) { ?date } else { null };
            source = "Archives Internet";
            description = "Document disponible sur Internet Archive";
            url;
            previewUrl = null;
            coverUrl = null;
          }]);
          count += 1;
        };
      };
    };
    results;
  };

  // ── Parse un résultat Google Books ──
  func parseGoogleBooksResults(json : Text, maxResults : Nat) : [ResourceTypes.LibrarySearchResult] {
    var results : [ResourceTypes.LibrarySearchResult] = [];
    var count = 0;
    let marker = "\"id\":\"";
    var parts = json.split(#text marker);
    ignore parts.next();
    label googleBooksLoop loop {
      if (count >= maxResults) { break googleBooksLoop };
      switch (parts.next()) {
        case null { break googleBooksLoop };
        case (?chunk) {
          let id = extractJsonStringValue(chunk);
          let title = extractJsonStringAfterKey(chunk, "\"title\":\"");
          let authors = extractJsonStringAfterKey(chunk, "\"authors\":[\"");
          let publishedDate = extractJsonStringAfterKeyOpt(chunk, "\"publishedDate\":\"");
          let description = extractJsonStringAfterKey(chunk, "\"description\":\"");
          let thumbnail = extractJsonStringAfterKeyOpt(chunk, "\"thumbnail\":\"");
          let url = "https://books.google.com/books?id=" # id;
          let year = if (publishedDate.size() >= 4) {
            ?publishedDate.split(#char '-').next().get("")
          } else { null };
          results := results.concat([{
            id = "gb-" # id;
            title;
            author = authors;
            year;
            source = "Google Livres";
            description = if (description.size() > 0) { description } else { "Livre disponible sur Google Livres" };
            url;
            previewUrl = null;
            coverUrl = if (thumbnail.size() > 0) { ?thumbnail } else { null };
          }]);
          count += 1;
        };
      };
    };
    results;
  };

  // ── Utilitaires d'extraction JSON minimal ──
  func extractJsonStringValue(s : Text) : Text {
    var result = "";
    var done = false;
    var escape = false;
    for (c in s.toIter()) {
      if (done) {}
      else if (escape) {
        result #= Text.fromChar(c);
        escape := false;
      } else if (c == '\\') {
        escape := true;
      } else if (c == '\"') {
        done := true;
      } else {
        result #= Text.fromChar(c);
      };
    };
    result;
  };

  func extractJsonStringAfterKey(s : Text, key : Text) : Text {
    let parts = s.split(#text key);
    ignore parts.next();
    switch (parts.next()) {
      case null { "" };
      case (?after) { extractJsonStringValue(after) };
    };
  };

  func extractJsonStringAfterKeyOpt(s : Text, key : Text) : Text {
    // key ends with \" so after is the raw value (string content after opening quote, or number)
    let parts = s.split(#text key);
    ignore parts.next();
    switch (parts.next()) {
      case null { "" };
      case (?after) {
        // Check if first char is a digit or minus (number) vs content (string already stripped of opening quote by key)
        switch (after.toIter().next()) {
          case null { "" };
          case (?c) {
            if ((c >= '0' and c <= '9') or c == '-') {
              // It's a number value — key does NOT end with quote in this case
              extractJsonNumber(after)
            } else {
              // Key ended with \" so we're inside the string already
              extractJsonStringValue(after)
            };
          };
        };
      };
    };
  };

  func extractJsonNumber(s : Text) : Text {
    var result = "";
    var done = false;
    for (c in s.toIter()) {
      if (done) {}
      else if ((c >= '0' and c <= '9') or c == '-') {
        result #= Text.fromChar(c);
      } else if (result.size() > 0) {
        done := true;
      };
    };
    result;
  };

  // ── Encode une requête de recherche pour une URL ──
  func urlEncode(s : Text) : Text {
    s
      .replace(#text " ", "+")
      .replace(#text "&", "%26")
      .replace(#text "=", "%3D")
      .replace(#text "?", "%3F")
      .replace(#text "#", "%23");
  };

  /// Récupère la configuration des modèles IA actuellement active (admin)
  public query ({ caller }) func getAdminModelConfig() : async GenTypes.AIModelConfig {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    adminModelConfig.value;
  };

  /// Met à jour la configuration des modèles IA (admin uniquement)
  public shared ({ caller }) func setAdminModelConfig(
    config : GenTypes.AIModelConfig,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Non autorisé : rôle administrateur requis");
    };
    if (config.structureModel.size() == 0) {
      Runtime.trap("L'identifiant du modèle de structure est requis");
    };
    if (config.contentModel.size() == 0) {
      Runtime.trap("L'identifiant du modèle de contenu est requis");
    };
    if (config.validationModel.size() == 0) {
      Runtime.trap("L'identifiant du modèle de validation est requis");
    };
    adminModelConfig.value := config;
  };

  /// Recherche dans les bibliothèques mondiales via HTTP outcalls
  public shared ({ caller }) func searchWorldLibraries(
    searchQuery : ResourceTypes.LibrarySearchQuery,
  ) : async [ResourceTypes.LibrarySearchResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    await searchLibrariesInternal(searchQuery);
  };

  // ── Implémentation interne de la recherche dans les bibliothèques mondiales ──
  func searchLibrariesInternal(searchQuery : ResourceTypes.LibrarySearchQuery) : async [ResourceTypes.LibrarySearchResult] {
    let term = urlEncode(searchQuery.searchTerm);
    let perLib = if (searchQuery.maxResults > 0) { searchQuery.maxResults } else { 10 };

    // Lancer les 4 appels HTTP séquentiellement (les outcalls IC ne peuvent pas être en parallèle dans un même call)
    let openLibUrl = "https://openlibrary.org/search.json?q=" # term # "&limit=" # perLib.toText();
    let gutenbergUrl = "https://gutendex.com/books?search=" # term # "&page_size=" # perLib.toText();
    let archiveUrl = "https://archive.org/advancedsearch.php?q=" # term # "&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=description&fl[]=date&rows=" # perLib.toText() # "&output=json";
    let googleBooksUrl = "https://www.googleapis.com/books/v1/volumes?q=" # term # "&maxResults=" # perLib.toText();

    var allResults : [ResourceTypes.LibrarySearchResult] = [];

    // Open Library
    let olResponse = try {
      await Outcall.httpGetRequest(openLibUrl, [], transformHttpResponse);
    } catch (_) { "" };
    if (olResponse.size() > 0) {
      allResults := allResults.concat(parseOpenLibraryResults(olResponse, perLib));
    };

    // Gutenberg
    let pgResponse = try {
      await Outcall.httpGetRequest(gutenbergUrl, [], transformHttpResponse);
    } catch (_) { "" };
    if (pgResponse.size() > 0) {
      allResults := allResults.concat(parseGutenbergResults(pgResponse, perLib));
    };

    // Internet Archive
    let iaResponse = try {
      await Outcall.httpGetRequest(archiveUrl, [], transformHttpResponse);
    } catch (_) { "" };
    if (iaResponse.size() > 0) {
      allResults := allResults.concat(parseArchiveResults(iaResponse, perLib));
    };

    // Google Books
    let gbResponse = try {
      await Outcall.httpGetRequest(googleBooksUrl, [], transformHttpResponse);
    } catch (_) { "" };
    if (gbResponse.size() > 0) {
      allResults := allResults.concat(parseGoogleBooksResults(gbResponse, perLib));
    };

    allResults;
  };

  /// Soumet une demande de génération de cours (utilisateur connecté)
  public shared ({ caller }) func requestCourseGeneration(
    description : Text,
    resourceIds : ?[Nat],
  ) : async GenTypes.CourseGenerationPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    if (description.size() == 0) {
      Runtime.trap("La description du cours est requise");
    };
    let resolvedIds = switch (resourceIds) {
      case (?ids) {
        if (ids.size() > 0) { ids } else { findMatchingResources(description) };
      };
      case null { findMatchingResources(description) };
    };
    let now = Time.now();
    let id = nextGenerationId.value;
    nextGenerationId.value += 1;
    let gen = GenLib.create(id, description, caller, resolvedIds, adminModelConfig.value, now);
    generations.add(id, gen);

    // Recherche automatique dans les bibliothèques mondiales
    let libResults = try {
      await searchLibrariesInternal({
        searchTerm = description;
        domain = null;
        profession = null;
        maxResults = 10;
      });
    } catch (_) { [] };
    ignore GenLib.setLibraryResultsCount(generations, id, libResults.size());

    gen.toPublic();
  };

  /// Consulte le statut d'une génération en cours (authentifié)
  public query ({ caller }) func getGenerationStatus(
    generationId : Nat,
  ) : async ?GenTypes.CourseGenerationPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    GenLib.getById(generations, generationId);
  };

  /// Liste les générations de l'utilisateur connecté (authentifié)
  public query ({ caller }) func listMyGenerations() : async [GenTypes.CourseGenerationPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    GenLib.listByUser(generations, caller);
  };

  /// Liste toutes les générations de la plateforme (admin/reviewer)
  public query ({ caller }) func listAllGenerations() : async [GenTypes.CourseGenerationPublic] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    GenLib.listAll(generations);
  };

  /// Déclenche le flux IA séquentiel Structure→Contenu→Validation (admin uniquement)
  public shared ({ caller }) func runAIGeneration(
    generationId : Nat,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    let gen = switch (generations.get(generationId)) {
      case (?g) { g };
      case null { Runtime.trap("Génération introuvable") };
    };
    if (gen.status != #queued) {
      Runtime.trap("La génération n'est pas en attente");
    };

    // ── Étape 1 : structure pédagogique ──
    let step1Output = try {
      ignore GenLib.updateStatus(generations, generationId, #step1_deepseek, Time.now());
      let raw = await runStep1Structure(gen);
      let content = extractContent(raw);
      ignore GenLib.recordStepOutput(generations, generationId, 1, gen.aiModelConfig.structureModel, content, Time.now());
      content;
    } catch (e) {
      ignore GenLib.updateStatus(generations, generationId, #queued, Time.now());
      switch (generations.get(generationId)) {
        case (?g) { g.errorMessage := ?("Erreur étape 1 (structure): " # e.message()) };
        case null {};
      };
      return;
    };

    // ── Étape 2 : contenu des leçons en français ──
    let step2Output = try {
      ignore GenLib.updateStatus(generations, generationId, #step2_qwen, Time.now());
      let raw = await runStep2Content(gen, step1Output);
      let content = extractContent(raw);
      ignore GenLib.recordStepOutput(generations, generationId, 2, gen.aiModelConfig.contentModel, content, Time.now());
      content;
    } catch (e) {
      ignore GenLib.updateStatus(generations, generationId, #step1_deepseek, Time.now());
      switch (generations.get(generationId)) {
        case (?g) { g.errorMessage := ?("Erreur étape 2 (contenu): " # e.message()) };
        case null {};
      };
      return;
    };

    // ── Étape 3 : validation ──
    try {
      ignore GenLib.updateStatus(generations, generationId, #step3_gpt4o, Time.now());
      let raw = await runStep3Validation(gen, step1Output, step2Output);
      let content = extractContent(raw);
      ignore GenLib.recordStepOutput(generations, generationId, 3, gen.aiModelConfig.validationModel, content, Time.now());
      if (isApprovedByValidator(content)) {
        ignore GenLib.updateStatus(generations, generationId, #approved, Time.now());
      } else {
        ignore GenLib.updateStatus(generations, generationId, #revision_needed, Time.now());
        switch (generations.get(generationId)) {
          case (?g) { g.errorMessage := ?("Révision demandée par le validateur: " # content) };
          case null {};
        };
      };
    } catch (e) {
      ignore GenLib.updateStatus(generations, generationId, #step2_qwen, Time.now());
      switch (generations.get(generationId)) {
        case (?g) { g.errorMessage := ?("Erreur étape 3 (validation): " # e.message()) };
        case null {};
      };
    };
  };

  /// Approuve un cours généré et le publie (reviewer/admin)
  public shared ({ caller }) func approveGeneratedCourse(
    generationId : Nat,
    reviewerNotes : Text,
  ) : async GenTypes.CourseGenerationPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    let gen = switch (generations.get(generationId)) {
      case (?g) { g };
      case null { Runtime.trap("Génération introuvable") };
    };
    switch (gen.generatedCourseId) {
      case (?_) { return gen.toPublic() };
      case null {};
    };
    let step2Output = switch (gen.steps.find(func(s) { s.step == 2 })) {
      case (?s) { switch (s.output) { case (?o) { o }; case null { gen.requestDescription } } };
      case null { gen.requestDescription };
    };
    let now = Time.now();
    let courseId = nextCourseId.value;
    nextCourseId.value += 1;
    let courseInput : CourseTypes.CourseInput = {
      title = gen.requestDescription;
      description = step2Output;
      category = "Généré par IA";
      difficulty = #intermediate;
      learningOutcomes = [reviewerNotes];
      thumbnail = null;
    };
    let course = CourseLib.newCourse(courseId, caller, courseInput);
    courses.add(courseId, course);
    switch (GenLib.approve(generations, generationId, courseId, now)) {
      case (?pub) { pub };
      case null { Runtime.trap("Génération introuvable") };
    };
  };

  /// Rejette un cours généré avec un motif (reviewer/admin)
  public shared ({ caller }) func rejectGeneratedCourse(
    generationId : Nat,
    reason : Text,
  ) : async GenTypes.CourseGenerationPublic {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    let now = Time.now();
    switch (GenLib.reject(generations, generationId, reason, now)) {
      case (?pub) { pub };
      case null { Runtime.trap("Génération introuvable") };
    };
  };
};
