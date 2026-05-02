import { c as createLucideIcon, a6 as useListDomains, aW as useCreateDomain, aX as useUpdateDomain, aY as useDeleteDomain, r as reactExports, j as jsxRuntimeExports, L as Layout, e as Button, aZ as ShieldCheck, B as Badge, T as Trash2, h as ue, ad as Label, I as Input } from "./index-D09cs5UV.js";
import { A as AdminGuard } from "./AdminGuard-DAeZUvHt.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BocCJxur.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-CmLIPMum.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DApGOtxs.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { S as Switch } from "./switch-CqpoEhT-.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { P as Plus } from "./plus-Ca2hIDM0.js";
import { C as Crown } from "./crown-CzuuUfNc.js";
import { L as Layers } from "./layers-ivYnSAUB.js";
import { P as Pencil } from "./pencil-CwU6fOmZ.js";
import "./x-DU9MTTQ_.js";
import "./index-CG-zuoud.js";
import "./check-CCiK2Afk.js";
import "./chevron-up-CGPOmjX1.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
const EMPTY_FORM = {
  name: "",
  description: "",
  tier: "standard",
  requiresManualApproval: false
};
function DomainTierBadge({ tier }) {
  if (tier === "vip") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "size-3" }),
      "VIP"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-3" }),
    "Standard"
  ] });
}
function DomainFormDialog({
  open,
  initial,
  onClose,
  onSubmit,
  isPending,
  title
}) {
  const [form, setForm] = reactExports.useState(initial);
  const handleSubmit = () => {
    if (!form.name.trim()) {
      ue.error("Le nom du domaine est requis.");
      return;
    }
    onSubmit(form);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "domains.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "domain-name", children: "Nom du domaine *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "domain-name",
            placeholder: "ex. Comptabilité & Finance",
            value: form.name,
            onChange: (e) => setForm({ ...form, name: e.target.value }),
            "data-ocid": "domains.name_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "domain-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "domain-desc",
            placeholder: "Brève description du domaine de formation...",
            rows: 3,
            value: form.description,
            onChange: (e) => setForm({ ...form, description: e.target.value }),
            "data-ocid": "domains.description_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Niveau" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.tier,
            onValueChange: (v) => setForm({ ...form, tier: v }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "domains.tier_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "standard", children: "Standard" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "vip", children: "VIP — Certification Premium" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Certificat manuel requis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "L'admin valide chaque certificat manuellement" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: form.requiresManualApproval,
            onCheckedChange: (v) => setForm({ ...form, requiresManualApproval: v }),
            "data-ocid": "domains.manual_approval_switch"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onClose,
          "data-ocid": "domains.cancel_button",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: handleSubmit,
          disabled: isPending,
          "data-ocid": "domains.submit_button",
          children: isPending ? "Enregistrement..." : "Enregistrer"
        }
      )
    ] })
  ] }) });
}
function DeleteConfirmDialog({
  domain,
  onConfirm,
  onCancel,
  isPending
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "domains.delete_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }),
      "Supprimer ce domaine"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Êtes-vous sûr de vouloir supprimer le domaine",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: domain.name }),
      " ? Cette action est irréversible."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onCancel,
          "data-ocid": "domains.delete_cancel_button",
          children: "Annuler"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "destructive",
          onClick: onConfirm,
          disabled: isPending,
          "data-ocid": "domains.delete_confirm_button",
          children: isPending ? "Suppression..." : "Supprimer"
        }
      )
    ] })
  ] }) });
}
function AdminDomainsPage() {
  const { data: domains = [], isLoading } = useListDomains();
  const createDomain = useCreateDomain();
  const updateDomain = useUpdateDomain();
  const deleteDomain = useDeleteDomain();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [editingDomain, setEditingDomain] = reactExports.useState(null);
  const [deletingDomain, setDeletingDomain] = reactExports.useState(null);
  const handleCreate = (form) => {
    createDomain.mutate(form, {
      onSuccess: () => {
        ue.success(`Domaine "${form.name}" créé avec succès`);
        setShowCreate(false);
      },
      onError: () => ue.error("Erreur lors de la création")
    });
  };
  const handleUpdate = (form) => {
    if (!editingDomain) return;
    updateDomain.mutate(
      {
        id: editingDomain.id,
        tier: form.tier,
        requiresManualApproval: form.requiresManualApproval,
        name: form.name,
        description: form.description
      },
      {
        onSuccess: () => {
          ue.success(`Domaine "${form.name}" mis à jour`);
          setEditingDomain(null);
        },
        onError: () => ue.error("Erreur lors de la mise à jour")
      }
    );
  };
  const handleDelete = () => {
    if (!deletingDomain) return;
    deleteDomain.mutate(
      { id: deletingDomain.id },
      {
        onSuccess: () => {
          ue.success("Domaine supprimé");
          setDeletingDomain(null);
        },
        onError: () => ue.error("Erreur lors de la suppression")
      }
    );
  };
  const vipCount = domains.filter((d) => d.tier === "vip").length;
  const manualCount = domains.filter((d) => d.requiresManualApproval).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_domains.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium", children: "Administration" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground", children: "Domaines de Formation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Gérez les catégories VIP et Standard" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setShowCreate(true),
            className: "gap-2 shrink-0",
            "data-ocid": "admin_domains.create_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              "Nouveau Domaine"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "size-4 text-accent mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Domaines VIP :" }),
          " ",
          "Les domaines VIP nécessitent une approbation manuelle avant la délivrance des certificats. Les apprenants reçoivent leur certificat uniquement après validation par l'administrateur."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [
        {
          label: "Total domaines",
          value: domains.length,
          icon: FolderOpen,
          color: "text-primary",
          bg: "bg-primary/10"
        },
        {
          label: "Domaines VIP",
          value: vipCount,
          icon: Crown,
          color: "text-yellow-600",
          bg: "bg-yellow-100"
        },
        {
          label: "Approbation manuelle",
          value: manualCount,
          icon: ShieldCheck,
          color: "text-accent",
          bg: "bg-accent/10"
        }
      ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 px-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `size-4 ${stat.color}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: stat.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: stat.label })
      ] }) }, stat.label)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "admin_domains.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4 text-primary" }),
          "Liste des domaines",
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto", children: domains.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Domaine" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Niveau" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Approbation manuelle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [1, 2, 3, 4].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, j)) }, i)) : domains.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 4,
              className: "text-center py-12 text-muted-foreground",
              "data-ocid": "admin_domains.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "size-8 mx-auto mb-2 opacity-40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Aucun domaine créé pour le moment" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "mt-2 gap-1 text-primary",
                    onClick: () => setShowCreate(true),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
                      "Créer le premier domaine"
                    ]
                  }
                )
              ]
            }
          ) }) : domains.map((domain, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border hover:bg-muted/20 transition-colors",
              "data-ocid": `admin_domains.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: domain.name }),
                  domain.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: domain.description })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DomainTierBadge, { tier: domain.tier }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: domain.requiresManualApproval ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-medium text-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3" }),
                  "Oui"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Non" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 px-2 gap-1",
                      onClick: () => setEditingDomain(domain),
                      "data-ocid": `admin_domains.edit_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3" }),
                        "Éditer"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-7 px-2 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10",
                      onClick: () => setDeletingDomain(domain),
                      "data-ocid": `admin_domains.delete_button.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                        "Supprimer"
                      ]
                    }
                  )
                ] }) })
              ]
            },
            String(domain.id)
          )) })
        ] }) }) })
      ] })
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DomainFormDialog,
      {
        open: showCreate,
        initial: EMPTY_FORM,
        onClose: () => setShowCreate(false),
        onSubmit: handleCreate,
        isPending: createDomain.isPending,
        title: "Nouveau domaine de formation"
      }
    ),
    editingDomain && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DomainFormDialog,
      {
        open: !!editingDomain,
        initial: {
          name: editingDomain.name,
          description: editingDomain.description,
          tier: editingDomain.tier,
          requiresManualApproval: editingDomain.requiresManualApproval
        },
        onClose: () => setEditingDomain(null),
        onSubmit: handleUpdate,
        isPending: updateDomain.isPending,
        title: `Modifier : ${editingDomain.name}`
      }
    ),
    deletingDomain && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DeleteConfirmDialog,
      {
        domain: deletingDomain,
        onConfirm: handleDelete,
        onCancel: () => setDeletingDomain(null),
        isPending: deleteDomain.isPending
      }
    )
  ] }) });
}
export {
  AdminDomainsPage as default
};
