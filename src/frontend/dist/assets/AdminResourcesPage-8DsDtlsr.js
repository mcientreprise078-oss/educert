import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Layout, v as BookOpen, an as useIndexResourceText, ai as useListResources, e as Button, I as Input, B as Badge, i as useListExternalCourses, k as useTrackExternalCourseView, h as ue, ao as useUploadResource, a7 as Label, ap as useUpdateResourceMetadata, aq as useDeleteResource, ar as useAddExternalCourse, as as useDeleteExternalCourse } from "./index-Duog9_D-.js";
import { A as AdminGuard } from "./AdminGuard-B7BbpzcT.js";
import { C as Card, a as CardContent } from "./card-CITtkol-.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-DAjRiK9X.js";
import { S as Skeleton } from "./skeleton-Cm0MP4Fa.js";
import { T as Textarea } from "./textarea-4SNoECiM.js";
import { P as Plus, T as Trash2 } from "./trash-2-DeWXHkw6.js";
import { S as Search } from "./search-_iB2ze7s.js";
import { E as ExternalLink } from "./external-link-CarBnmYU.js";
import { P as Play } from "./play-BondzuFB.js";
import { G as Globe } from "./globe-D7BZgG-C.js";
import { F as FileText } from "./file-text-aUT_o40x.js";
import { P as Pencil } from "./pencil-BRGGiQ0t.js";
import { R as RefreshCw } from "./refresh-cw-BOF-1Ti5.js";
import { E as Eye } from "./eye-DlVNadCE.js";
import { U as Upload } from "./upload-ByEZoPDJ.js";
import { X } from "./x-D2e544UD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M8 13h2", key: "yr2amv" }],
  ["path", { d: "M14 13h2", key: "un5t4a" }],
  ["path", { d: "M8 17h2", key: "2yhykz" }],
  ["path", { d: "M14 17h2", key: "10kma7" }]
];
const FileSpreadsheet = createLucideIcon("file-spreadsheet", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
      key: "1q2vi4"
    }
  ],
  ["path", { d: "m10 15 5-3-5-3z", key: "1jp15x" }]
];
const Youtube = createLucideIcon("youtube", __iconNode);
const TYPE_ICONS = {
  pdf: FileText,
  word: FileText,
  excel: FileSpreadsheet,
  html: Globe,
  video: Play,
  youtube: Youtube,
  weblink: ExternalLink
};
const TYPE_LABELS = {
  pdf: "PDF",
  word: "Word",
  excel: "Excel",
  html: "HTML",
  video: "Vidéo",
  youtube: "YouTube",
  weblink: "Lien Web"
};
const TYPE_COLORS = {
  pdf: "text-destructive bg-destructive/10",
  word: "text-primary bg-primary/10",
  excel: "text-primary bg-primary/10",
  html: "text-accent bg-accent/10",
  video: "text-accent bg-accent/10",
  youtube: "text-destructive bg-destructive/10",
  weblink: "text-muted-foreground bg-muted"
};
const STATUS_VARIANTS = {
  indexed: "default",
  pending: "secondary",
  error: "destructive"
};
const STATUS_LABELS = {
  indexed: "Indexé",
  pending: "En attente",
  error: "Erreur"
};
const TYPE_FILTERS = [
  { value: "all", label: "Tous" },
  { value: "pdf", label: "PDF" },
  { value: "word", label: "Word" },
  { value: "excel", label: "Excel" },
  { value: "html", label: "HTML" },
  { value: "video", label: "Vidéo" },
  { value: "youtube", label: "YouTube" },
  { value: "weblink", label: "Lien Web" }
];
const PLATFORM_COLORS = {
  YouTube: "text-destructive bg-destructive/10",
  Coursera: "text-primary bg-primary/10",
  Udemy: "text-accent bg-accent/10",
  "LinkedIn Learning": "text-primary bg-primary/10",
  edX: "text-accent bg-accent/10",
  OpenClassrooms: "text-primary bg-primary/10",
  Autre: "text-muted-foreground bg-muted"
};
function detectPlatform(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("coursera.org")) return "Coursera";
  if (url.includes("udemy.com")) return "Udemy";
  if (url.includes("linkedin.com/learning")) return "LinkedIn Learning";
  if (url.includes("edx.org")) return "edX";
  if (url.includes("openclassrooms.com")) return "OpenClassrooms";
  return "Autre";
}
function getYoutubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}
function KeywordInput({
  value,
  onChange
}) {
  const [input, setInput] = reactExports.useState("");
  const add = () => {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          },
          placeholder: "Ajouter un mot-clé...",
          className: "flex-1"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: add, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }) })
    ] }),
    value.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: value.map((kw) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1 text-xs pr-1", children: [
      kw,
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => onChange(value.filter((k) => k !== kw)),
          className: "hover:text-destructive transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
        }
      )
    ] }, kw)) })
  ] });
}
function EditMetadataDialog({
  resource,
  open,
  onClose
}) {
  const updateMetadata = useUpdateResourceMetadata();
  const [title, setTitle] = reactExports.useState(resource.title);
  const [description, setDescription] = reactExports.useState(resource.description);
  const [keywords, setKeywords] = reactExports.useState(resource.keywords);
  const [subjects, setSubjects] = reactExports.useState(resource.subjects);
  const [subjectInput, setSubjectInput] = reactExports.useState("");
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
          ue.success("Métadonnées mises à jour");
          onClose();
        },
        onError: () => ue.error("Erreur lors de la mise à jour")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md max-h-[90vh] overflow-y-auto",
      "data-ocid": "admin_resources.edit_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Modifier la ressource" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-title", children: "Titre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "edit-title",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                "data-ocid": "admin_resources.edit_title_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-desc", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "edit-desc",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                rows: 3,
                className: "resize-none",
                "data-ocid": "admin_resources.edit_description_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mots-clés" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeywordInput, { value: keywords, onChange: setKeywords })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Domaines thématiques" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: subjectInput,
                  onChange: (e) => setSubjectInput(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubject();
                    }
                  },
                  placeholder: "Ajouter un domaine..."
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: addSubject,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" })
                }
              )
            ] }),
            subjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "gap-1 text-xs pr-1",
                children: [
                  s,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setSubjects(subjects.filter((x) => x !== s)),
                      className: "hover:text-destructive transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
                    }
                  )
                ]
              },
              s
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin_resources.edit_cancel_button",
              children: "Annuler"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: updateMetadata.isPending,
              "data-ocid": "admin_resources.edit_save_button",
              children: updateMetadata.isPending ? "Enregistrement..." : "Enregistrer"
            }
          )
        ] })
      ]
    }
  ) });
}
function DeleteConfirmDialog({
  resource,
  open,
  onClose
}) {
  const deleteResource = useDeleteResource();
  const handleDelete = () => {
    if (!resource) return;
    deleteResource.mutate(resource.id, {
      onSuccess: () => {
        ue.success(`"${resource.title}" supprimé`);
        onClose();
      },
      onError: () => ue.error("Erreur lors de la suppression")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm",
      "data-ocid": "admin_resources.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Supprimer la ressource" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground py-2", children: [
          "Êtes-vous sûr de vouloir supprimer",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            '"',
            resource == null ? void 0 : resource.title,
            '"'
          ] }),
          " ? Cette action est irréversible."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin_resources.delete_cancel_button",
              children: "Annuler"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: handleDelete,
              disabled: deleteResource.isPending,
              "data-ocid": "admin_resources.delete_confirm_button",
              children: deleteResource.isPending ? "Suppression..." : "Supprimer"
            }
          )
        ] })
      ]
    }
  ) });
}
function UploadDialog({
  open,
  onClose
}) {
  const uploadResource = useUploadResource();
  const fileInputRef = reactExports.useRef(null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [mode, setMode] = reactExports.useState("file");
  const [droppedFile, setDroppedFile] = reactExports.useState(null);
  const [linkUrl, setLinkUrl] = reactExports.useState("");
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [keywords, setKeywords] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [subjectInput, setSubjectInput] = reactExports.useState("");
  const detectLinkType = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "youtube";
    return "weblink";
  };
  const getFileType = (file) => {
    var _a;
    const ext = (_a = file.name.split(".").pop()) == null ? void 0 : _a.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (ext === "doc" || ext === "docx") return "word";
    if (ext === "xls" || ext === "xlsx" || ext === "csv") return "excel";
    if (ext === "html" || ext === "htm") return "html";
    if (ext === "mp4" || ext === "webm" || ext === "avi") return "video";
    return "pdf";
  };
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setDroppedFile(file);
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    },
    [title]
  );
  const handleFileSelect = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
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
      ue.error("Le titre est requis");
      return;
    }
    if (mode === "file" && !droppedFile) {
      ue.error("Veuillez sélectionner un fichier");
      return;
    }
    if (mode === "link" && !linkUrl.trim()) {
      ue.error("Veuillez saisir une URL");
      return;
    }
    const resourceType = mode === "file" ? getFileType(droppedFile) : detectLinkType(linkUrl);
    uploadResource.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        resourceType,
        fileUrl: mode === "file" ? `/assets/docs/${droppedFile.name}` : void 0,
        externalUrl: mode === "link" ? linkUrl.trim() : void 0,
        keywords,
        subjects
      },
      {
        onSuccess: () => {
          ue.success("Ressource ajoutée avec succès");
          onClose();
        },
        onError: () => ue.error("Erreur lors de l'ajout")
      }
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) {
          reset();
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-lg max-h-[92vh] overflow-y-auto",
          "data-ocid": "admin_resources.upload_dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Ajouter une ressource" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 p-1 bg-muted/50 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `flex-1 flex items-center justify-center gap-2 text-sm py-1.5 px-3 rounded-md transition-smooth ${mode === "file" ? "bg-card shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`,
                  onClick: () => setMode("file"),
                  "data-ocid": "admin_resources.upload_mode_file",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5" }),
                    " Fichier"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `flex-1 flex items-center justify-center gap-2 text-sm py-1.5 px-3 rounded-md transition-smooth ${mode === "link" ? "bg-card shadow-sm text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`,
                  onClick: () => setMode("link"),
                  "data-ocid": "admin_resources.upload_mode_link",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" }),
                    " Lien externe"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              mode === "file" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: `w-full relative border-2 border-dashed rounded-xl p-8 text-center transition-smooth cursor-pointer ${isDragging ? "border-primary bg-primary/5" : droppedFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"}`,
                  onDragOver: (e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  },
                  onDragLeave: () => setIsDragging(false),
                  onDrop: handleDrop,
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "admin_resources.dropzone",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: fileInputRef,
                        type: "file",
                        className: "hidden",
                        accept: ".pdf,.doc,.docx,.xls,.xlsx,.csv,.html,.htm,.mp4,.webm",
                        onChange: handleFileSelect
                      }
                    ),
                    droppedFile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-8 text-primary mx-auto mb-2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: droppedFile.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                        (droppedFile.size / 1024 / 1024).toFixed(2),
                        " MB"
                      ] })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-8 text-muted-foreground mx-auto mb-2" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: "Glissez-déposez votre fichier ici" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "PDF, Word, Excel, HTML, Vidéo" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          className: "mt-3",
                          type: "button",
                          children: "Parcourir les fichiers"
                        }
                      )
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "link-url", children: "URL (YouTube ou site web)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  linkUrl.includes("youtube") || linkUrl.includes("youtu.be") ? /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "link-url",
                      value: linkUrl,
                      onChange: (e) => setLinkUrl(e.target.value),
                      placeholder: "https://youtube.com/... ou https://site.com/...",
                      className: "pl-9",
                      "data-ocid": "admin_resources.link_url_input"
                    }
                  )
                ] }),
                linkUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Type détecté :",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: TYPE_LABELS[detectLinkType(linkUrl)] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "res-title", children: "Titre *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "res-title",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "Titre de la ressource...",
                    "data-ocid": "admin_resources.title_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "res-desc", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "res-desc",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    placeholder: "Décrivez brièvement le contenu de cette ressource...",
                    rows: 2,
                    className: "resize-none",
                    "data-ocid": "admin_resources.description_textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mots-clés" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(KeywordInput, { value: keywords, onChange: setKeywords })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Domaines thématiques" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: subjectInput,
                      onChange: (e) => setSubjectInput(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSubject();
                        }
                      },
                      placeholder: "Ex: Gestion de Projets..."
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: addSubject,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" })
                    }
                  )
                ] }),
                subjects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: subjects.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "gap-1 text-xs pr-1",
                    children: [
                      s,
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setSubjects(subjects.filter((x) => x !== s)),
                          className: "hover:text-destructive transition-colors",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" })
                        }
                      )
                    ]
                  },
                  s
                )) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    reset();
                    onClose();
                  },
                  "data-ocid": "admin_resources.upload_cancel_button",
                  children: "Annuler"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleSubmit,
                  disabled: uploadResource.isPending,
                  "data-ocid": "admin_resources.upload_submit_button",
                  children: uploadResource.isPending ? "Ajout en cours..." : "Ajouter la ressource"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function AddExternalCourseDialog({
  open,
  onClose
}) {
  const addCourse = useAddExternalCourse();
  const [url, setUrl] = reactExports.useState("");
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const detectedPlatform = url.trim() ? detectPlatform(url) : null;
  const ytId = url.trim() ? getYoutubeId(url) : null;
  const handleSubmit = () => {
    if (!url.trim()) {
      ue.error("Le lien du cours est requis");
      return;
    }
    if (!title.trim()) {
      ue.error("Le titre du cours est requis");
      return;
    }
    addCourse.mutate(
      { url: url.trim(), title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          ue.success("Cours externe ajouté avec succès");
          onClose();
        },
        onError: () => ue.error("Erreur lors de l'ajout")
      }
    );
  };
  const reset = () => {
    setUrl("");
    setTitle("");
    setDescription("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dialog,
    {
      open,
      onOpenChange: (o) => {
        if (!o) {
          reset();
          onClose();
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        DialogContent,
        {
          className: "max-w-lg max-h-[92vh] overflow-y-auto",
          "data-ocid": "admin_external_courses.add_dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Ajouter un cours externe" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ext-url", children: "Lien du cours *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "ext-url",
                      value: url,
                      onChange: (e) => setUrl(e.target.value),
                      placeholder: "https://youtube.com/watch?v=... ou https://coursera.org/...",
                      className: "pl-9",
                      "data-ocid": "admin_external_courses.url_input"
                    }
                  )
                ] }),
                detectedPlatform && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Plateforme détectée :",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `font-medium px-1.5 py-0.5 rounded text-xs ${PLATFORM_COLORS[detectedPlatform] ?? "text-muted-foreground bg-muted"}`,
                      children: detectedPlatform
                    }
                  )
                ] })
              ] }),
              ytId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden border border-border aspect-video w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "iframe",
                {
                  src: `https://www.youtube.com/embed/${ytId}`,
                  title: "Aperçu YouTube",
                  className: "w-full h-full",
                  allowFullScreen: true
                }
              ) }),
              url.trim() && !ytId && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-2 text-xs text-primary hover:underline",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" }),
                    "Ouvrir le lien dans un nouvel onglet"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ext-title", children: "Titre du cours *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ext-title",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "Nom du cours tel qu'affiché sur la plateforme...",
                    "data-ocid": "admin_external_courses.title_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ext-desc", children: "Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "ext-desc",
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    placeholder: "Décrivez brièvement ce cours et son utilité pour vos apprenants...",
                    rows: 3,
                    className: "resize-none",
                    "data-ocid": "admin_external_courses.description_textarea"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    reset();
                    onClose();
                  },
                  "data-ocid": "admin_external_courses.cancel_button",
                  children: "Annuler"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: handleSubmit,
                  disabled: addCourse.isPending,
                  "data-ocid": "admin_external_courses.submit_button",
                  children: addCourse.isPending ? "Ajout en cours..." : "Ajouter le cours"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function DeleteExternalCourseDialog({
  course,
  open,
  onClose
}) {
  const deleteCourse = useDeleteExternalCourse();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm",
      "data-ocid": "admin_external_courses.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Supprimer le cours externe" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground py-2", children: [
          "Supprimer",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-foreground", children: [
            '"',
            course == null ? void 0 : course.title,
            '"'
          ] }),
          " de la plateforme ? Cette action est irréversible."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin_external_courses.delete_cancel_button",
              children: "Annuler"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              disabled: deleteCourse.isPending,
              onClick: () => {
                if (!course) return;
                deleteCourse.mutate(course.id, {
                  onSuccess: () => {
                    ue.success(`"${course.title}" supprimé`);
                    onClose();
                  },
                  onError: () => ue.error("Erreur lors de la suppression")
                });
              },
              "data-ocid": "admin_external_courses.delete_confirm_button",
              children: deleteCourse.isPending ? "Suppression..." : "Supprimer"
            }
          )
        ] })
      ]
    }
  ) });
}
function ExternalCoursesTab() {
  const { data: courses = [], isLoading } = useListExternalCourses();
  const trackView = useTrackExternalCourseView();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "admin_external_courses.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Chargement..." : `${courses.length} cours externe${courses.length !== 1 ? "s" : ""}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-2",
          onClick: () => setAddOpen(true),
          "data-ocid": "admin_external_courses.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
            "Ajouter un cours externe"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "divide-y divide-border",
        "data-ocid": "admin_external_courses.loading_state",
        children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-10 rounded-lg shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3 mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" })
          ] })
        ] }, k))
      }
    ) : courses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 px-6",
        "data-ocid": "admin_external_courses.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "size-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg mb-2", children: "Aucun cours externe ajouté" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm mx-auto", children: "Collez le lien d'un cours depuis YouTube, Coursera, Udemy ou tout autre plateforme de formation." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setAddOpen(true),
              "data-ocid": "admin_external_courses.empty_add_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
                "Ajouter le premier cours"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: courses.map((course, i) => {
      const platformColor = PLATFORM_COLORS[course.platform] ?? "text-muted-foreground bg-muted";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors duration-150",
          "data-ocid": `admin_external_courses.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center", children: course.thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: course.thumbnailUrl,
                alt: course.title,
                className: "w-full h-full object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "size-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground truncate", children: course.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${platformColor}`,
                    children: course.platform
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mb-1", children: course.description || course.url }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3" }),
                  Number(course.viewCount),
                  " vue",
                  Number(course.viewCount) !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Ajouté le",
                  " ",
                  new Date(Number(course.addedAt)).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-8 text-muted-foreground hover:text-primary",
                  asChild: true,
                  onClick: () => trackView.mutate(course.id),
                  "data-ocid": `admin_external_courses.open_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: course.url,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      "aria-label": "Ouvrir",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" })
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-8 text-muted-foreground hover:text-destructive",
                  onClick: () => setDeleteTarget(course),
                  "aria-label": "Supprimer",
                  "data-ocid": `admin_external_courses.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                }
              )
            ] })
          ]
        },
        course.id
      );
    }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddExternalCourseDialog,
      {
        open: addOpen,
        onClose: () => setAddOpen(false)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteExternalCourseDialog,
      {
        course: deleteTarget,
        open: !!deleteTarget,
        onClose: () => setDeleteTarget(null)
      }
    )
  ] });
}
function ResourcesTab() {
  const [search, setSearch] = reactExports.useState("");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [uploadOpen, setUploadOpen] = reactExports.useState(false);
  const [editResource, setEditResource] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const indexResource = useIndexResourceText();
  const { data: resources = [], isLoading } = useListResources(
    typeFilter === "all" ? void 0 : typeFilter,
    search || void 0
  );
  const handleReindex = (resource) => {
    indexResource.mutate(
      { id: resource.id },
      {
        onSuccess: () => ue.success(`"${resource.title}" réindexé`),
        onError: () => ue.error("Erreur lors de la réindexation")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? "Chargement..." : `${resources.length} ressource${resources.length !== 1 ? "s" : ""}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "gap-2",
          onClick: () => setUploadOpen(true),
          "data-ocid": "admin_resources.upload_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3.5" }),
            "Ajouter une ressource"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Rechercher par titre, mots-clés...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9",
            "data-ocid": "admin_resources.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5 flex-wrap", children: TYPE_FILTERS.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setTypeFilter(value),
          className: `px-3 py-1 text-xs rounded-full border transition-smooth ${typeFilter === value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`,
          "data-ocid": `admin_resources.filter_${value}`,
          children: label
        },
        value
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "divide-y divide-border",
        "data-ocid": "admin_resources.loading_state",
        children: ["a", "b", "c", "d"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-lg shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-2/3 mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full mb-1.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/3" })
          ] })
        ] }, k))
      }
    ) : resources.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 px-6",
        "data-ocid": "admin_resources.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-lg mb-2", children: "Aucune ressource trouvée" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm mx-auto", children: search || typeFilter !== "all" ? "Aucun résultat pour votre recherche. Essayez d'autres termes." : "Commencez par uploader des PDF, vidéos ou ajouter des liens YouTube et sites de formation." }),
          !search && typeFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setUploadOpen(true),
              "data-ocid": "admin_resources.empty_upload_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
                "Ajouter la première ressource"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: resources.map((resource, i) => {
      const Icon = TYPE_ICONS[resource.resourceType];
      const colorClass = TYPE_COLORS[resource.resourceType];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors duration-150",
          "data-ocid": `admin_resources.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: resource.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs shrink-0", children: TYPE_LABELS[resource.resourceType] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: STATUS_VARIANTS[resource.status],
                    className: "text-xs shrink-0",
                    children: STATUS_LABELS[resource.status]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1 mb-1.5", children: resource.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                resource.keywords.slice(0, 4).map((kw) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground",
                    children: kw
                  },
                  kw
                )),
                resource.keywords.length > 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  "+",
                  resource.keywords.length - 4
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5", children: [
                "Ajouté le",
                " ",
                new Date(resource.uploadedAt).toLocaleDateString(
                  "fr-FR",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-8 text-muted-foreground hover:text-primary",
                  onClick: () => setEditResource(resource),
                  "aria-label": "Modifier",
                  "data-ocid": `admin_resources.edit_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" })
                }
              ),
              resource.status !== "indexed" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-8 text-muted-foreground hover:text-accent",
                  onClick: () => handleReindex(resource),
                  disabled: indexResource.isPending,
                  "aria-label": "Réindexer",
                  "data-ocid": `admin_resources.reindex_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "size-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-8 text-muted-foreground hover:text-destructive",
                  onClick: () => setDeleteTarget(resource),
                  "aria-label": "Supprimer",
                  "data-ocid": `admin_resources.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                }
              )
            ] })
          ]
        },
        resource.id
      );
    }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(UploadDialog, { open: uploadOpen, onClose: () => setUploadOpen(false) }),
    editResource && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditMetadataDialog,
      {
        resource: editResource,
        open: !!editResource,
        onClose: () => setEditResource(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        resource: deleteTarget,
        open: !!deleteTarget,
        onClose: () => setDeleteTarget(null)
      }
    )
  ] });
}
function AdminResourcesPage() {
  const [activeTab, setActiveTab] = reactExports.useState("resources");
  const tabs = [
    { value: "resources", label: "Ressources scientifiques", icon: BookOpen },
    { value: "external", label: "Cours Externes", icon: Link2 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGuard, { adminOnly: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_resources.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Bibliothèque de ressources" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Gérez les ressources pédagogiques et cours externes utilisés par l'IA pour générer les formations." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 p-1 bg-muted/50 rounded-xl w-fit", children: tabs.map(({ value, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setActiveTab(value),
        className: `flex items-center gap-2 text-sm py-2 px-4 rounded-lg transition-smooth ${activeTab === value ? "bg-card shadow-sm text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`,
        "data-ocid": `admin_resources.tab_${value}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
          label
        ]
      },
      value
    )) }),
    activeTab === "resources" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResourcesTab, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalCoursesTab, {})
  ] }) }) });
}
export {
  AdminResourcesPage as default
};
