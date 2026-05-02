import { AdminGuard } from "@/components/AdminGuard";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddExternalCourse,
  useDeleteExternalCourse,
  useDeleteResource,
  useImportGoogleDoc,
  useIndexResourceText,
  useListExternalCourses,
  useListResources,
  useTrackExternalCourseView,
  useUpdateResourceMetadata,
  useUploadResource,
} from "@/lib/queries";
import type { ExternalCourse, Resource, ResourceType } from "@/lib/types";
import {
  BookOpen,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  FileUp,
  Globe,
  Link2,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
  Youtube,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ---- Constants ----

const TYPE_ICONS: Record<
  ResourceType,
  React.ComponentType<{ className?: string }>
> = {
  pdf: FileText,
  word: FileText,
  excel: FileSpreadsheet,
  html: Globe,
  video: Play,
  youtube: Youtube,
  weblink: ExternalLink,
};

const TYPE_LABELS: Record<ResourceType, string> = {
  pdf: "PDF",
  word: "Word",
  excel: "Excel",
  html: "HTML",
  video: "Vidéo",
  youtube: "YouTube",
  weblink: "Lien Web",
};

const TYPE_COLORS: Record<ResourceType, string> = {
  pdf: "text-destructive bg-destructive/10",
  word: "text-primary bg-primary/10",
  excel: "text-primary bg-primary/10",
  html: "text-accent bg-accent/10",
  video: "text-accent bg-accent/10",
  youtube: "text-destructive bg-destructive/10",
  weblink: "text-muted-foreground bg-muted",
};

const STATUS_VARIANTS = {
  indexed: "default",
  pending: "secondary",
  error: "destructive",
} as const;

const STATUS_LABELS = {
  indexed: "Indexé",
  pending: "En attente",
  error: "Erreur",
} as const;

const TYPE_FILTERS: Array<{ value: ResourceType | "all"; label: string }> = [
  { value: "all", label: "Tous" },
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word" },
  { value: "excel", label: "Excel" },
  { value: "html", label: "HTML" },
  { value: "video", label: "Vidéo" },
  { value: "youtube", label: "YouTube" },
  { value: "weblink", label: "Lien Web" },
];

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "text-destructive bg-destructive/10",
  Coursera: "text-primary bg-primary/10",
  Udemy: "text-accent bg-accent/10",
  "LinkedIn Learning": "text-primary bg-primary/10",
  edX: "text-accent bg-accent/10",
  OpenClassrooms: "text-primary bg-primary/10",
  Autre: "text-muted-foreground bg-muted",
};

// ---- Helpers ----

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("coursera.org")) return "Coursera";
  if (url.includes("udemy.com")) return "Udemy";
  if (url.includes("linkedin.com/learning")) return "LinkedIn Learning";
  if (url.includes("edx.org")) return "edX";
  if (url.includes("openclassrooms.com")) return "OpenClassrooms";
  return "Autre";
}

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ---- Shared sub-components ----

function KeywordInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Ajouter un mot-clé..."
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="size-3.5" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((kw) => (
            <Badge key={kw} variant="secondary" className="gap-1 text-xs pr-1">
              {kw}
              <button
                type="button"
                onClick={() => onChange(value.filter((k) => k !== kw))}
                className="hover:text-destructive transition-colors"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Edit dialog ----

function EditMetadataDialog({
  resource,
  open,
  onClose,
}: {
  resource: Resource;
  open: boolean;
  onClose: () => void;
}) {
  const updateMetadata = useUpdateResourceMetadata();
  const [title, setTitle] = useState(resource.title);
  const [description, setDescription] = useState(resource.description);
  const [keywords, setKeywords] = useState<string[]>(resource.keywords);
  const [subjects, setSubjects] = useState<string[]>(resource.subjects);
  const [subjectInput, setSubjectInput] = useState("");

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const handleSave = () => {
    updateMetadata.mutate(
      { id: resource.id, title, description, keywords, subjects },
      {
        onSuccess: () => {
          toast.success("Métadonnées mises à jour");
          onClose();
        },
        onError: () => toast.error("Erreur lors de la mise à jour"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        data-ocid="admin_resources.edit_dialog"
      >
        <DialogHeader>
          <DialogTitle>Modifier la ressource</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title">Titre</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="admin_resources.edit_title_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
              data-ocid="admin_resources.edit_description_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Mots-clés</Label>
            <KeywordInput value={keywords} onChange={setKeywords} />
          </div>
          <div className="space-y-1.5">
            <Label>Domaines thématiques</Label>
            <div className="flex gap-2">
              <Input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                placeholder="Ajouter un domaine..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubject}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {subjects.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="gap-1 text-xs pr-1"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        setSubjects(subjects.filter((x) => x !== s))
                      }
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_resources.edit_cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMetadata.isPending}
            data-ocid="admin_resources.edit_save_button"
          >
            {updateMetadata.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- Delete dialog ----

function DeleteConfirmDialog({
  resource,
  open,
  onClose,
}: {
  resource: Resource | null;
  open: boolean;
  onClose: () => void;
}) {
  const deleteResource = useDeleteResource();

  const handleDelete = () => {
    if (!resource) return;
    deleteResource.mutate(resource.id, {
      onSuccess: () => {
        toast.success(`"${resource.title}" supprimé`);
        onClose();
      },
      onError: () => toast.error("Erreur lors de la suppression"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-sm"
        data-ocid="admin_resources.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle>Supprimer la ressource</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-2">
          Êtes-vous sûr de vouloir supprimer{" "}
          <strong className="text-foreground">"{resource?.title}"</strong> ?
          Cette action est irréversible.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_resources.delete_cancel_button"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteResource.isPending}
            data-ocid="admin_resources.delete_confirm_button"
          >
            {deleteResource.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- Upload dialog ----

function UploadDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const uploadResource = useUploadResource();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mode, setMode] = useState<"file" | "link">("file");
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState("");

  const detectLinkType = (url: string): ResourceType => {
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "youtube";
    return "weblink";
  };

  const getFileType = (file: File): ResourceType => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (ext === "doc" || ext === "docx") return "word";
    if (ext === "xls" || ext === "xlsx" || ext === "csv") return "excel";
    if (ext === "html" || ext === "htm") return "html";
    if (ext === "mp4" || ext === "webm" || ext === "avi") return "video";
    return "pdf";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setDroppedFile(file);
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    },
    [title],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDroppedFile(file);
      if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubjectInput("");
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    if (mode === "file" && !droppedFile) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    if (mode === "link" && !linkUrl.trim()) {
      toast.error("Veuillez saisir une URL");
      return;
    }
    const resourceType =
      mode === "file" ? getFileType(droppedFile!) : detectLinkType(linkUrl);
    uploadResource.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        resourceType,
        fileUrl:
          mode === "file" ? `/assets/docs/${droppedFile!.name}` : undefined,
        externalUrl: mode === "link" ? linkUrl.trim() : undefined,
        keywords,
        subjects,
      },
      {
        onSuccess: () => {
          toast.success("Ressource ajoutée avec succès");
          onClose();
        },
        onError: () => toast.error("Erreur lors de l'ajout"),
      },
    );
  };

  const reset = () => {
    setMode("file");
    setDroppedFile(null);
    setLinkUrl("");
    setTitle("");
    setDescription("");
    setKeywords([]);
    setSubjects([]);
    setSubjectInput("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-lg max-h-[92vh] overflow-y-auto"
        data-ocid="admin_resources.upload_dialog"
      >
        <DialogHeader>
          <DialogTitle>Ajouter une ressource</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 text-sm py-1.5 px-3 rounded-md transition-smooth ${
              mode === "file"
                ? "bg-card shadow-sm text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("file")}
            data-ocid="admin_resources.upload_mode_file"
          >
            <Upload className="size-3.5" /> Fichier
          </button>
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 text-sm py-1.5 px-3 rounded-md transition-smooth ${
              mode === "link"
                ? "bg-card shadow-sm text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setMode("link")}
            data-ocid="admin_resources.upload_mode_link"
          >
            <ExternalLink className="size-3.5" /> Lien externe
          </button>
        </div>

        <div className="space-y-4">
          {mode === "file" ? (
            <button
              type="button"
              className={`w-full relative border-2 border-dashed rounded-xl p-8 text-center transition-smooth cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : droppedFile
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              data-ocid="admin_resources.dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.html,.htm,.mp4,.webm"
                onChange={handleFileSelect}
              />
              {droppedFile ? (
                <div>
                  <FileText className="size-8 text-primary mx-auto mb-2" />
                  <p className="font-medium text-sm text-foreground">
                    {droppedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(droppedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-medium text-sm text-foreground">
                    Glissez-déposez votre fichier ici
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, Word, Excel, HTML, Vidéo
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    type="button"
                  >
                    Parcourir les fichiers
                  </Button>
                </div>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="link-url">URL (YouTube ou site web)</Label>
                <div className="relative">
                  {linkUrl.includes("youtube") ||
                  linkUrl.includes("youtu.be") ? (
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-destructive" />
                  ) : (
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  )}
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://youtube.com/... ou https://site.com/..."
                    className="pl-9"
                    data-ocid="admin_resources.link_url_input"
                  />
                </div>
                {linkUrl && (
                  <p className="text-xs text-muted-foreground">
                    Type détecté :{" "}
                    <strong>{TYPE_LABELS[detectLinkType(linkUrl)]}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="res-title">Titre *</Label>
            <Input
              id="res-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la ressource..."
              data-ocid="admin_resources.title_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="res-desc">Description</Label>
            <Textarea
              id="res-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement le contenu de cette ressource..."
              rows={2}
              className="resize-none"
              data-ocid="admin_resources.description_textarea"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Mots-clés</Label>
            <KeywordInput value={keywords} onChange={setKeywords} />
          </div>

          <div className="space-y-1.5">
            <Label>Domaines thématiques</Label>
            <div className="flex gap-2">
              <Input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                placeholder="Ex: Gestion de Projets..."
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubject}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {subjects.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="gap-1 text-xs pr-1"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() =>
                        setSubjects(subjects.filter((x) => x !== s))
                      }
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
            data-ocid="admin_resources.upload_cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploadResource.isPending}
            data-ocid="admin_resources.upload_submit_button"
          >
            {uploadResource.isPending
              ? "Ajout en cours..."
              : "Ajouter la ressource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- Add external course dialog ----

function AddExternalCourseDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const addCourse = useAddExternalCourse();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const detectedPlatform = url.trim() ? detectPlatform(url) : null;
  const ytId = url.trim() ? getYoutubeId(url) : null;

  const handleSubmit = () => {
    if (!url.trim()) {
      toast.error("Le lien du cours est requis");
      return;
    }
    if (!title.trim()) {
      toast.error("Le titre du cours est requis");
      return;
    }
    addCourse.mutate(
      { url: url.trim(), title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          toast.success("Cours externe ajouté avec succès");
          onClose();
        },
        onError: () => toast.error("Erreur lors de l'ajout"),
      },
    );
  };

  const reset = () => {
    setUrl("");
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-lg max-h-[92vh] overflow-y-auto"
        data-ocid="admin_external_courses.add_dialog"
      >
        <DialogHeader>
          <DialogTitle>Ajouter un cours externe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="ext-url">Lien du cours *</Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="ext-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou https://coursera.org/..."
                className="pl-9"
                data-ocid="admin_external_courses.url_input"
              />
            </div>
            {detectedPlatform && (
              <p className="text-xs text-muted-foreground">
                Plateforme détectée :{" "}
                <span
                  className={`font-medium px-1.5 py-0.5 rounded text-xs ${PLATFORM_COLORS[detectedPlatform] ?? "text-muted-foreground bg-muted"}`}
                >
                  {detectedPlatform}
                </span>
              </p>
            )}
          </div>

          {/* YouTube preview */}
          {ytId && (
            <div className="rounded-xl overflow-hidden border border-border aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title="Aperçu YouTube"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {/* Non-YouTube preview */}
          {url.trim() && !ytId && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary hover:underline"
            >
              <ExternalLink className="size-3.5" />
              Ouvrir le lien dans un nouvel onglet
            </a>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ext-title">Titre du cours *</Label>
            <Input
              id="ext-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nom du cours tel qu'affiché sur la plateforme..."
              data-ocid="admin_external_courses.title_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ext-desc">Description</Label>
            <Textarea
              id="ext-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez brièvement ce cours et son utilité pour vos apprenants..."
              rows={3}
              className="resize-none"
              data-ocid="admin_external_courses.description_textarea"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
            data-ocid="admin_external_courses.cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addCourse.isPending}
            data-ocid="admin_external_courses.submit_button"
          >
            {addCourse.isPending ? "Ajout en cours..." : "Ajouter le cours"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- Delete external course dialog ----

function DeleteExternalCourseDialog({
  course,
  open,
  onClose,
}: {
  course: ExternalCourse | null;
  open: boolean;
  onClose: () => void;
}) {
  const deleteCourse = useDeleteExternalCourse();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-sm"
        data-ocid="admin_external_courses.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle>Supprimer le cours externe</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-2">
          Supprimer{" "}
          <strong className="text-foreground">"{course?.title}"</strong> de la
          plateforme ? Cette action est irréversible.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_external_courses.delete_cancel_button"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            disabled={deleteCourse.isPending}
            onClick={() => {
              if (!course) return;
              deleteCourse.mutate(course.id, {
                onSuccess: () => {
                  toast.success(`"${course.title}" supprimé`);
                  onClose();
                },
                onError: () => toast.error("Erreur lors de la suppression"),
              });
            }}
            data-ocid="admin_external_courses.delete_confirm_button"
          >
            {deleteCourse.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- External courses tab ----

function ExternalCoursesTab() {
  const { data: courses = [], isLoading } = useListExternalCourses();
  const trackView = useTrackExternalCourseView();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExternalCourse | null>(null);

  return (
    <div className="space-y-4" data-ocid="admin_external_courses.section">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Chargement..."
            : `${courses.length} cours externe${courses.length !== 1 ? "s" : ""}`}
        </p>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setAddOpen(true)}
          data-ocid="admin_external_courses.add_button"
        >
          <Plus className="size-3.5" />
          Ajouter un cours externe
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="divide-y divide-border"
              data-ocid="admin_external_courses.loading_state"
            >
              {(["a", "b", "c"] as const).map((k) => (
                <div key={k} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="w-16 h-10 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div
              className="text-center py-16 px-6"
              data-ocid="admin_external_courses.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                <Link2 className="size-8 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground text-lg mb-2">
                Aucun cours externe ajouté
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                Collez le lien d'un cours depuis YouTube, Coursera, Udemy ou
                tout autre plateforme de formation.
              </p>
              <Button
                onClick={() => setAddOpen(true)}
                data-ocid="admin_external_courses.empty_add_button"
              >
                <Plus className="size-4 mr-2" />
                Ajouter le premier cours
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {courses.map((course, i) => {
                const platformColor =
                  PLATFORM_COLORS[course.platform] ??
                  "text-muted-foreground bg-muted";
                return (
                  <div
                    key={course.id}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors duration-150"
                    data-ocid={`admin_external_courses.item.${i + 1}`}
                  >
                    {/* Thumbnail or icon */}
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Globe className="size-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-medium text-sm text-foreground truncate">
                          {course.title}
                        </p>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${platformColor}`}
                        >
                          {course.platform}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                        {course.description || course.url}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="size-3" />
                          {Number(course.viewCount)} vue
                          {Number(course.viewCount) !== 1 ? "s" : ""}
                        </span>
                        <span>
                          Ajouté le{" "}
                          {new Date(Number(course.addedAt)).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-primary"
                        asChild
                        onClick={() => trackView.mutate(course.id)}
                        data-ocid={`admin_external_courses.open_button.${i + 1}`}
                      >
                        <a
                          href={course.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ouvrir"
                        >
                          <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(course)}
                        aria-label="Supprimer"
                        data-ocid={`admin_external_courses.delete_button.${i + 1}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddExternalCourseDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
      <DeleteExternalCourseDialog
        course={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ---- Google Docs import panel ----

function GoogleDocsImportPanel() {
  const importGoogleDoc = useImportGoogleDoc();
  const [docUrl, setDocUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleImport = () => {
    if (!docUrl.trim()) {
      toast.error("L'URL du document est requise");
      return;
    }
    if (!title.trim()) {
      toast.error("Le titre du document est requis");
      return;
    }
    importGoogleDoc.mutate(
      { docUrl: docUrl.trim(), title: title.trim(), userId: "current" },
      {
        onSuccess: () => {
          toast.success("Document importé avec succès");
          setDocUrl("");
          setTitle("");
        },
        onError: () => toast.error("Erreur lors de l'importation du document"),
      },
    );
  };

  return (
    <Card
      className="border-border"
      data-ocid="admin_resources.google_docs_panel"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileUp className="size-3.5 text-primary" />
          </div>
          Importer depuis Google Docs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="gdoc-url">URL du document Google Docs</Label>
          <Input
            id="gdoc-url"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="https://docs.google.com/document/d/..."
            data-ocid="admin_resources.google_docs_url_input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gdoc-title">Titre du document</Label>
          <Input
            id="gdoc-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Guide de gestion de projet..."
            data-ocid="admin_resources.google_docs_title_input"
          />
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={handleImport}
          disabled={importGoogleDoc.isPending}
          data-ocid="admin_resources.google_docs_import_button"
        >
          {importGoogleDoc.isPending ? (
            <>
              <RefreshCw className="size-3.5 animate-spin" />
              Importation...
            </>
          ) : (
            <>
              <FileUp className="size-3.5" />
              Importer le document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ---- Resources tab ----

function ResourcesTab() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const indexResource = useIndexResourceText();

  const { data: resources = [], isLoading } = useListResources(
    typeFilter === "all" ? undefined : typeFilter,
    search || undefined,
  );

  const handleReindex = (resource: Resource) => {
    indexResource.mutate(
      { id: resource.id },
      {
        onSuccess: () => toast.success(`"${resource.title}" réindexé`),
        onError: () => toast.error("Erreur lors de la réindexation"),
      },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Chargement..."
            : `${resources.length} ressource${resources.length !== 1 ? "s" : ""}`}
        </p>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setUploadOpen(true)}
          data-ocid="admin_resources.upload_button"
        >
          <Plus className="size-3.5" />
          Ajouter une ressource
        </Button>
      </div>

      {/* Search + filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par titre, mots-clés..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-ocid="admin_resources.search_input"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {TYPE_FILTERS.map(({ value, label }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={`px-3 py-1 text-xs rounded-full border transition-smooth ${
                    typeFilter === value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                  data-ocid={`admin_resources.filter_${value}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource list */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="divide-y divide-border"
              data-ocid="admin_resources.loading_state"
            >
              {(["a", "b", "c", "d"] as const).map((k) => (
                <div key={k} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-3 w-full mb-1.5" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div
              className="text-center py-16 px-6"
              data-ocid="admin_resources.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="size-8 text-muted-foreground" />
              </div>
              <p className="font-display font-semibold text-foreground text-lg mb-2">
                Aucune ressource trouvée
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                {search || typeFilter !== "all"
                  ? "Aucun résultat pour votre recherche. Essayez d'autres termes."
                  : "Commencez par uploader des PDF, vidéos ou ajouter des liens YouTube et sites de formation."}
              </p>
              {!search && typeFilter === "all" && (
                <Button
                  onClick={() => setUploadOpen(true)}
                  data-ocid="admin_resources.empty_upload_button"
                >
                  <Plus className="size-4 mr-2" />
                  Ajouter la première ressource
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {resources.map((resource, i) => {
                const Icon = TYPE_ICONS[resource.resourceType];
                const colorClass = TYPE_COLORS[resource.resourceType];
                return (
                  <div
                    key={resource.id}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors duration-150"
                    data-ocid={`admin_resources.item.${i + 1}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                      <Icon className="size-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="font-medium text-sm text-foreground">
                          {resource.title}
                        </p>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {TYPE_LABELS[resource.resourceType]}
                        </Badge>
                        <Badge
                          variant={STATUS_VARIANTS[resource.status]}
                          className="text-xs shrink-0"
                        >
                          {STATUS_LABELS[resource.status]}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                        {resource.description}
                      </p>

                      <div className="flex items-center gap-3 flex-wrap">
                        {resource.keywords.slice(0, 4).map((kw) => (
                          <span
                            key={kw}
                            className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {kw}
                          </span>
                        ))}
                        {resource.keywords.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{resource.keywords.length - 4}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-1.5">
                        Ajouté le{" "}
                        {new Date(resource.uploadedAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-primary"
                        onClick={() => setEditResource(resource)}
                        aria-label="Modifier"
                        data-ocid={`admin_resources.edit_button.${i + 1}`}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      {resource.status !== "indexed" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-accent"
                          onClick={() => handleReindex(resource)}
                          disabled={indexResource.isPending}
                          aria-label="Réindexer"
                          data-ocid={`admin_resources.reindex_button.${i + 1}`}
                        >
                          <RefreshCw className="size-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteTarget(resource)}
                        aria-label="Supprimer"
                        data-ocid={`admin_resources.delete_button.${i + 1}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <GoogleDocsImportPanel />
      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
      {editResource && (
        <EditMetadataDialog
          resource={editResource}
          open={!!editResource}
          onClose={() => setEditResource(null)}
        />
      )}
      <DeleteConfirmDialog
        resource={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ---- Main page ----

type Tab = "resources" | "external";

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("resources");

  const tabs: Array<{
    value: Tab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { value: "resources", label: "Ressources scientifiques", icon: BookOpen },
    { value: "external", label: "Cours Externes", icon: Link2 },
  ];

  return (
    <AdminGuard adminOnly>
      <Layout>
        <div className="space-y-6" data-ocid="admin_resources.page">
          {/* Header */}
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Bibliothèque de ressources
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gérez les ressources pédagogiques et cours externes utilisés par
              l'IA pour générer les formations.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl w-fit">
            {tabs.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`flex items-center gap-2 text-sm py-2 px-4 rounded-lg transition-smooth ${
                  activeTab === value
                    ? "bg-card shadow-sm text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`admin_resources.tab_${value}`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "resources" ? (
            <ResourcesTab />
          ) : (
            <ExternalCoursesTab />
          )}
        </div>
      </Layout>
    </AdminGuard>
  );
}
