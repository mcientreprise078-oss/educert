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
  // NOTE: La clé fournie est partiellement masquée. Remplacez 'sk-ef855d58e' par votre clé réelle complète.
  let OPENROUTER_API_KEY = "sk-ef855d58e";
  let OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
  // ── Résout le preset IA → configuration concrète des modèles ──
  func resolvePreset(preset : GenTypes.AIModelPreset) : GenTypes.AIModelConfig {
    switch (preset) {
      case (#default) {
        { structureModel = "deepseek/deepseek-r1"; contentModel = "qwen/qwen-2.5-72b-instruct"; validationModel = "openai/gpt-4o" };
      };
      case (#claudeValidation) {
        { structureModel = "deepseek/deepseek-r1"; contentModel = "qwen/qwen-2.5-72b-instruct"; validationModel = "anthropic/claude-3-5-sonnet" };
      };
      case (#gpt5Validation) {
        { structureModel = "deepseek/deepseek-r1"; contentModel = "qwen/qwen-2.5-72b-instruct"; validationModel = "openai/gpt-4o" };
      };
      case (#fullClaude) {
        { structureModel = "anthropic/claude-3-5-sonnet"; contentModel = "anthropic/claude-3-5-sonnet"; validationModel = "anthropic/claude-3-5-sonnet" };
      };
      case (#gemini_flash) {
        { structureModel = "google/gemini-flash-1.5"; contentModel = "google/gemini-flash-1.5"; validationModel = "google/gemini-flash-1.5" };
      };
    };
  };

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
  // ── Étape 1 : modèle de structure (défaut DeepSeek) + recherche YouTube des vidéos pertinentes ──
  func runStep1Structure(gen : GenTypes.CourseGeneration) : async Text {
    let resourceSummary = buildResourceSummary(gen.resourceIds);
    let systemPrompt = "Tu es un expert en ingénierie pédagogique. Génère en français une structure de cours professionnelle (objectifs, plan des leçons, prérequis, résultats attendus) basée sur la description et les ressources fournies. Réponds en JSON structuré. Si des vidéos YouTube sont fournies, inclus leurs identifiants comme marqueurs [VIDEO:videoId] aux endroits pertinents dans la structure.";
    // Recherche des vidéos YouTube pertinentes pour enrichir le cours
    let ytVideos = try {
      await searchYouTubeVideos(gen.requestDescription, 3);
    } catch (_) { [] };
    let ytSection = if (ytVideos.size() > 0) {
      let ytList = ytVideos.foldLeft("", func(acc, v) {
        let vid = switch (v.videoId) { case (?id) { id }; case null { "" } };
        if (vid.size() == 0) { acc }
        else { acc # "\n- [VIDEO:" # vid # "] " # v.title }
      });
      "\n\nVidéos YouTube pertinentes disponibles :" # ytList
    } else { "" };
    let userPrompt = "Description du cours: " # gen.requestDescription
      # "\n\nRessources disponibles:" # resourceSummary
      # ytSection
      # "\n\nGénère la structure pédagogique complète en JSON. Intègre les marqueurs [VIDEO:videoId] aux endroits appropriés dans les leçons.";
    let body = buildOpenRouterBody(gen.aiModelConfig.structureModel, systemPrompt, userPrompt);
    let headers = [
      { name = "Authorization"; value = "Bearer " # OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    try {
      await Outcall.httpPostRequest(OPENROUTER_URL, headers, body, transformHttpResponse);
    } catch (e) {
      Runtime.trap("Erreur API DeepSeek (étape 1 - structure) : " # e.message());
    };
  };

  // ── Étape 2 : modèle de contenu (défaut Qwen) — contenu des leçons en français ──
  // ── Étape 2 : modèle de contenu (défaut Qwen) — contenu des leçons en français ──
  func runStep2Content(gen : GenTypes.CourseGeneration, structure : Text) : async Text {
    let resourceSummary = buildResourceSummary(gen.resourceIds);
    let systemPrompt = "Tu es un rédacteur pédagogique expert. Sur la base de la structure fournie, génère en français le contenu complet et détaillé de chaque leçon. Utilise un ton formel et académique. Cite les ressources utilisées. Conserve les marqueurs [VIDEO:videoId] aux endroits indiqués.";
    let userPrompt = "Structure du cours:\n" # structure
      # "\n\nRessources:\n" # resourceSummary
      # "\n\nGénère le contenu complet de toutes les leçons en français. Conserve les marqueurs [VIDEO:videoId] dans le contenu.";
    let body = buildOpenRouterBody(gen.aiModelConfig.contentModel, systemPrompt, userPrompt);
    let headers = [
      { name = "Authorization"; value = "Bearer " # OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    try {
      await Outcall.httpPostRequest(OPENROUTER_URL, headers, body, transformHttpResponse);
    } catch (e) {
      Runtime.trap("Erreur API Qwen (étape 2 - contenu) : " # e.message());
    };
  };

  // ── Étape 3 : modèle de validation (défaut GPT-4o) ──
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
    try {
      await Outcall.httpPostRequest(OPENROUTER_URL, headers, body, transformHttpResponse);
    } catch (e) {
      Runtime.trap("Erreur API GPT-4o (étape 3 - validation) : " # e.message());
    };
  };

  // ── Helper : détermine si le modèle de validation approuve ──
  func isApprovedByValidator(validationResponse : Text) : Bool {
    let lower = validationResponse.toLower();
    lower.contains(#text "\"approved\":true") or lower.contains(#text "approved\": true");
  };

  // ── Parse un résultat Open Library (JSON minimal) ──
  // ── Parse un résultat Open Library (JSON minimal) ──
  func parseOpenLibraryResults(json : Text, maxResults : Nat) : [ResourceTypes.LibrarySearchResult] {
    var results : [ResourceTypes.LibrarySearchResult] = [];
    var count = 0;
    let docsMarker = "\"docs\":[";
    let parts = json.split(#text docsMarker);
    ignore parts.next();
    switch (parts.next()) {
      case null {};
      case (?docsSection) {
        let titleMarker = "\"title\":\"";
        var docParts = docsSection.split(#text titleMarker);
        ignore docParts.next();
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
                videoId = null;
                sourceType = ?"book";
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
            videoId = null;
            sourceType = ?"book";
          }]);
          count += 1;
        };
      };
    };
    results;
  };

  // ── Parse un résultat Internet Archive ──
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
            videoId = null;
            sourceType = ?"book";
          }]);
          count += 1;
        };
      };
    };
    results;
  };

  // ── Parse un résultat Google Books ──
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
            videoId = null;
            sourceType = ?"book";
          }]);
          count += 1;
        };
      };
    };
    results;
  };

  // ── YouTube Data API ──
  let YOUTUBE_API_KEY = "AIzaSyBqFSGMLcLfOx2UxVmQJKwbMFZByxSe1Ho";
  let YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

  // ── Parse les résultats de l'API YouTube Data v3 ──
  func parseYouTubeResults(json : Text, maxResults : Nat) : [ResourceTypes.LibrarySearchResult] {
    var results : [ResourceTypes.LibrarySearchResult] = [];
    var count = 0;
    let marker = "\"videoId\":\"";
    var parts = json.split(#text marker);
    ignore parts.next();
    label ytLoop loop {
      if (count >= maxResults) { break ytLoop };
      switch (parts.next()) {
        case null { break ytLoop };
        case (?chunk) {
          let videoId = extractJsonStringValue(chunk);
          if (videoId.size() == 0) { break ytLoop };
          let title = extractJsonStringAfterKey(chunk, "\"title\":\"");
          let description = extractJsonStringAfterKey(chunk, "\"description\":\"");
          let thumbnail = extractJsonStringAfterKey(chunk, "\"url\":\"");
          let channelTitle = extractJsonStringAfterKey(chunk, "\"channelTitle\":\"");
          let url = "https://youtube.com/watch?v=" # videoId;
          results := results.concat([{
            id = "yt-" # videoId;
            title = if (title.size() > 0) { title } else { "Vidéo YouTube" };
            author = channelTitle;
            year = null;
            source = "YouTube";
            description = if (description.size() > 0) { description } else { "Vidéo disponible sur YouTube" };
            url;
            previewUrl = if (thumbnail.size() > 0) { ?thumbnail } else { null };
            coverUrl = ?("https://img.youtube.com/vi/" # videoId # "/hqdefault.jpg");
            videoId = ?videoId;
            sourceType = ?"youtube";
          }]);
          count += 1;
        };
      };
    };
    results;
  };

  /// Recherche des vidéos YouTube via l'API Data v3
  func searchYouTubeVideos(searchQuery : Text, maxResults : Nat) : async [ResourceTypes.LibrarySearchResult] {
    let encodedQuery = urlEncode(searchQuery);
    let url = YOUTUBE_SEARCH_URL
      # "?part=snippet&q=" # encodedQuery
      # "&key=" # YOUTUBE_API_KEY
      # "&maxResults=" # maxResults.toText()
      # "&type=video";
    let resp = try {
      await Outcall.httpGetRequest(url, [], transformHttpResponse);
    } catch (_) { return [] };
    if (resp.size() == 0) { return [] };
    parseYouTubeResults(resp, maxResults);
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

  /// Génère un quiz de chapitre en appelant Qwen via OpenRouter
  /// Retourne une chaîne JSON contenant 5-8 questions à choix multiples
  public shared ({ caller }) func generateChapterQuiz(
    courseId : Common.CourseId,
    lessonId : Common.LessonId,
    lessonContent : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    if (lessonContent.size() == 0) {
      return #err("Le contenu de la leçon est requis pour générer un quiz");
    };
    let systemPrompt = "Tu es un expert en évaluation pédagogique. Génère en français entre 5 et 8 questions à choix multiples basées sur le contenu fourni. Réponds UNIQUEMENT avec un tableau JSON valide au format: [{\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"correctOptionIndex\": 0, \"explanation\": \"...\"}]. Aucun texte avant ou après le JSON.";
    let userPrompt = "Contenu de la leçon (cours " # courseId.toText() # ", leçon " # lessonId.toText() # "):\n\n" # lessonContent;
    let body = buildOpenRouterBody("qwen/qwen-2.5-72b-instruct", systemPrompt, userPrompt);
    let headers = [
      { name = "Authorization"; value = "Bearer " # OPENROUTER_API_KEY },
      { name = "Content-Type"; value = "application/json" },
      { name = "HTTP-Referer"; value = "https://educert.ic" },
    ];
    try {
      let raw = await Outcall.httpPostRequest(OPENROUTER_URL, headers, body, transformHttpResponse);
      #ok(extractContent(raw));
    } catch (e) {
      #err("Erreur lors de la génération du quiz : " # e.message());
    };
  };

  /// Recherche dans les bibliothèques réelles via HTTP outcalls
  /// sources : liste de sources parmi ["openlibrary", "googlebooks"]
  /// Retourne un tableau de chaînes JSON brutes (une par source)
  /// Recherche dans les bibliothèques réelles via HTTP outcalls
  public shared ({ caller }) func searchRealLibraries(
    searchTerm : Text,
    sources : [Text],
  ) : async [Text] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Non autorisé : connexion requise");
    };
    if (searchTerm.size() == 0) { return [] };
    let term = urlEncode(searchTerm);
    var results : [Text] = [];
    // Open Library
    if (sources.size() == 0 or sources.find(func(s) { s == "openlibrary" }) != null) {
      let url = "https://openlibrary.org/search.json?q=" # term # "&limit=10";
      let resp = try {
        await Outcall.httpGetRequest(url, [], transformHttpResponse);
      } catch (_) { "" };
      if (resp.size() > 0) { results := results.concat([resp]) };
    };
    // Google Books — avec clé API
    if (sources.size() == 0 or sources.find(func(s) { s == "googlebooks" }) != null) {
      let url = "https://www.googleapis.com/books/v1/volumes?q=" # term # "&maxResults=10&key=AIzaSyBPCJvRree9Ff0aBYrZNtXtQu9Rd1x8G2w";
      let resp = try {
        await Outcall.httpGetRequest(url, [], transformHttpResponse);
      } catch (_) { "" };
      if (resp.size() > 0) { results := results.concat([resp]) };
    };
    results;
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
  // ── Implémentation interne de la recherche dans les bibliothèques mondiales ──
  func searchLibrariesInternal(searchQuery : ResourceTypes.LibrarySearchQuery) : async [ResourceTypes.LibrarySearchResult] {
    let term = urlEncode(searchQuery.searchTerm);
    let perLib = if (searchQuery.maxResults > 0) { searchQuery.maxResults } else { 10 };

    let openLibUrl = "https://openlibrary.org/search.json?q=" # term # "&limit=" # perLib.toText();
    let gutenbergUrl = "https://gutendex.com/books?search=" # term # "&page_size=" # perLib.toText();
    let archiveUrl = "https://archive.org/advancedsearch.php?q=" # term # "&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=description&fl[]=date&rows=" # perLib.toText() # "&output=json";
    let googleBooksUrl = "https://www.googleapis.com/books/v1/volumes?q=" # term # "&maxResults=" # perLib.toText() # "&key=AIzaSyBPCJvRree9Ff0aBYrZNtXtQu9Rd1x8G2w";

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

    // Google Books — avec clé API
    let gbResponse = try {
      await Outcall.httpGetRequest(googleBooksUrl, [], transformHttpResponse);
    } catch (_) { "" };
    if (gbResponse.size() > 0) {
      allResults := allResults.concat(parseGoogleBooksResults(gbResponse, perLib));
    };

    // YouTube — vidéos pertinentes
    let ytResults = try {
      await searchYouTubeVideos(searchQuery.searchTerm, perLib);
    } catch (_) { [] };
    allResults := allResults.concat(ytResults);

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
