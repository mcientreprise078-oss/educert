import { c as createLucideIcon, b as useGetEnrollments, aT as useGenerateInactivityNotifications, r as reactExports, j as jsxRuntimeExports, L as Layout, e as Button, U as Users, I as Input, B as Badge, A as Avatar, z as AvatarFallback, h as ue, t as Clock, aE as Bell } from "./index-D09cs5UV.js";
import { A as AdminGuard } from "./AdminGuard-DAeZUvHt.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-BocCJxur.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-CmLIPMum.js";
import { P as Progress } from "./progress-DYV8D1s7.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DApGOtxs.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { B as Bot } from "./bot-RbbsHRbc.js";
import { C as CircleCheck } from "./circle-check-DuoBvN5I.js";
import { C as CircleX } from "./circle-x-Bb-Z_XDj.js";
import { S as Search } from "./search-ZqenjnHR.js";
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
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode);
function getLearnerName(learnerId) {
  const names = {
    u1: "Sophie Martin",
    u2: "Thomas Dubois",
    u3: "Clara Bernard",
    u4: "Lucas Petit",
    u5: "Emma Robert",
    u6: "Pierre Dupont",
    u7: "Julie Moreau",
    u8: "Antoine Lefebvre",
    u9: "Marie Simon",
    u10: "Nicolas Garcia",
    user1: "Alexandre Martin"
  };
  return names[learnerId] ?? `Apprenant ${learnerId}`;
}
function getLearnerEmail(learnerId) {
  const first = getLearnerName(learnerId).split(" ")[0].toLowerCase();
  return `${first}.${learnerId}@educert.cd`;
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 36e5);
  const d = Math.floor(diff / 864e5);
  if (h < 1) return "il y a moins d'1h";
  if (h < 24) return `il y a ${h}h`;
  if (d === 1) return "hier";
  if (d < 7) return `il y a ${d} jours`;
  const w = Math.floor(d / 7);
  return `il y a ${w} sem.`;
}
function buildLearnerStats(enrollments) {
  const byLearner = {};
  for (const e of enrollments) {
    if (!byLearner[e.learnerId]) byLearner[e.learnerId] = [];
    byLearner[e.learnerId].push(e);
  }
  return Object.entries(byLearner).map(([learnerId, enrs]) => {
    const avgProgress = Math.round(
      enrs.reduce((sum, e) => sum + e.progress, 0) / enrs.length
    );
    const lastActivity = Math.max(...enrs.map((e) => e.enrolledAt));
    const coursesCompleted = enrs.filter((e) => e.completedAt != null).length;
    const allCompleted = coursesCompleted === enrs.length && enrs.length > 0;
    const isInactive = Date.now() - lastActivity > 864e5;
    let status = "actif";
    if (allCompleted) status = "termine";
    else if (isInactive) status = "inactif";
    return {
      learnerId,
      name: getLearnerName(learnerId),
      email: getLearnerEmail(learnerId),
      enrollments: enrs,
      avgProgress,
      lastActivity,
      status,
      coursesCompleted,
      totalCourses: enrs.length
    };
  });
}
const STATUS_BADGE = {
  actif: {
    label: "Actif",
    className: "bg-primary/10 text-primary border-primary/20"
  },
  inactif: {
    label: "Inactif",
    className: "bg-destructive/10 text-destructive border-destructive/20"
  },
  termine: {
    label: "Terminé",
    className: "bg-accent/10 text-accent border-accent/20"
  }
};
function LearnerRowSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, i)) });
}
function LearnerDetailDrawer({
  learner,
  onClose
}) {
  const sendNotification = useGenerateInactivityNotifications();
  const handleSendNotification = () => {
    sendNotification.mutate(void 0, {
      onSuccess: () => ue.success(`Notification envoyée à ${learner.name}`),
      onError: () => ue.error("Erreur lors de l'envoi")
    });
  };
  const courseNames = {
    "1": "Gestion Avancée de Projets",
    "2": "Introduction à la Data Science",
    "3": "Leadership Authentique"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-lg max-h-[90vh] overflow-y-auto",
      "data-ocid": "learner_detail.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-base", children: "Profil de l'apprenant" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 bg-muted/40 rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-14 w-14 border-2 border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary font-bold text-lg", children: getInitials(learner.name) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-base", children: learner.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground truncate", children: learner.email }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_BADGE[learner.status].className}`,
                  children: STATUS_BADGE[learner.status].label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-3" }),
                "Inscrit",
                " ",
                relativeTime(
                  Math.min(...learner.enrollments.map((e) => e.enrolledAt))
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-accent" }),
            "Progression par cours"
          ] }),
          learner.enrollments.map((enr, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "p-3 rounded-lg border border-border bg-card",
              "data-ocid": `learner_detail.course_item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: courseNames[enr.courseId] ?? `Cours ${enr.courseId}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-primary ml-2 shrink-0", children: [
                    enr.progress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: enr.progress, className: "h-1.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    enr.completedLessons.length,
                    " leçons complétées"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Inscrit ",
                    relativeTime(enr.enrolledAt)
                  ] })
                ] }),
                enr.completedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1.5 text-xs text-primary", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
                  "Terminé ",
                  relativeTime(enr.completedAt)
                ] })
              ]
            },
            enr.id
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-accent" }),
            "Activité récente"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: learner.enrollments.slice(0, 5).map((enr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 text-sm text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex-1", children: [
                  "Leçon complétée dans",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: courseNames[enr.courseId] ?? `Cours ${enr.courseId}` })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs shrink-0", children: relativeTime(enr.enrolledAt) })
              ]
            },
            String(enr.courseId)
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSendNotification,
            disabled: sendNotification.isPending,
            className: "w-full gap-2",
            "data-ocid": "learner_detail.send_notification_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
              sendNotification.isPending ? "Envoi en cours..." : "Envoyer une notification"
            ]
          }
        )
      ]
    }
  ) });
}
function AdminLearnersPage() {
  const { data: enrollments = [], isLoading } = useGetEnrollments();
  const generateNotifications = useGenerateInactivityNotifications();
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("tous");
  const [selectedLearner, setSelectedLearner] = reactExports.useState(
    null
  );
  const [notifSentCount, setNotifSentCount] = reactExports.useState(null);
  const allLearners = reactExports.useMemo(
    () => buildLearnerStats(enrollments),
    [enrollments]
  );
  const filtered = reactExports.useMemo(() => {
    let list = allLearners;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(q));
    }
    if (filter === "inactifs")
      list = list.filter((l) => l.status === "inactif");
    else if (filter === "en_cours")
      list = list.filter((l) => l.status === "actif");
    else if (filter === "termines")
      list = list.filter((l) => l.status === "termine");
    return list;
  }, [allLearners, search, filter]);
  const inactiveCount = allLearners.filter(
    (l) => l.status === "inactif"
  ).length;
  const handleIABooster = () => {
    generateNotifications.mutate(void 0, {
      onSuccess: (count) => {
        const n = Number(count);
        setNotifSentCount(n);
        ue.success(
          `IA Booster : ${n} rappel${n !== 1 ? "s" : ""} envoyé${n !== 1 ? "s" : ""} aux apprenants inactifs`
        );
      },
      onError: () => ue.error("Erreur lors de l'envoi des rappels IA")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGuard, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_learners.page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium", children: "Administration" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-foreground", children: "Suivi des Apprenants" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Surveillance de la progression de chaque étudiant" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleIABooster,
              disabled: generateNotifications.isPending,
              className: "gap-2 bg-accent hover:bg-accent/90 text-accent-foreground",
              "data-ocid": "admin_learners.ia_booster_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "size-4" }),
                generateNotifications.isPending ? "Analyse en cours..." : "IA Booster — Envoyer rappels"
              ]
            }
          ),
          inactiveCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive font-medium", children: [
            inactiveCount,
            " apprenant",
            inactiveCount > 1 ? "s" : "",
            " ",
            "inactif",
            inactiveCount > 1 ? "s" : "",
            " (24h+)"
          ] }),
          notifSentCount !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-primary font-medium", children: [
            "✓ ",
            notifSentCount,
            " rappel",
            notifSentCount !== 1 ? "s" : "",
            " ",
            "envoyé",
            notifSentCount !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
        {
          label: "Total apprenants",
          value: allLearners.length,
          icon: Users,
          color: "text-primary",
          bg: "bg-primary/10"
        },
        {
          label: "Actifs",
          value: allLearners.filter((l) => l.status === "actif").length,
          icon: CircleCheck,
          color: "text-primary",
          bg: "bg-primary/10"
        },
        {
          label: "Inactifs (24h+)",
          value: inactiveCount,
          icon: CircleX,
          color: "text-destructive",
          bg: "bg-destructive/10"
        },
        {
          label: "Terminés",
          value: allLearners.filter((l) => l.status === "termine").length,
          icon: CircleCheck,
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Rechercher un apprenant...",
              className: "pl-9",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              "data-ocid": "admin_learners.search_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filter,
            onValueChange: (v) => setFilter(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-full sm:w-52",
                  "data-ocid": "admin_learners.filter_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "tous", children: "Tous les apprenants" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactifs", children: "Inactifs (24h+)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "en_cours", children: "En cours" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "termines", children: "Terminés" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { "data-ocid": "admin_learners.table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4 text-primary" }),
          "Apprenants inscrits",
          !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto", children: filtered.length })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Apprenant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Cours inscrits" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Dernier accès" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Progression" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Statut" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-medium text-muted-foreground", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(LearnerRowSkeleton, {}, i)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 6,
              className: "text-center py-12 text-muted-foreground",
              "data-ocid": "admin_learners.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-8 mx-auto mb-2 opacity-40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Aucun apprenant inscrit pour le moment" })
              ]
            }
          ) }) : filtered.map((learner, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border hover:bg-muted/20 transition-colors cursor-pointer",
              onClick: () => setSelectedLearner(learner),
              onKeyDown: (e) => e.key === "Enter" && setSelectedLearner(learner),
              "data-ocid": `admin_learners.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/10 text-primary text-xs font-bold", children: getInitials(learner.name) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: learner.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: learner.email })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: learner.totalCourses }),
                  learner.coursesCompleted > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
                    "(",
                    learner.coursesCompleted,
                    " terminé",
                    learner.coursesCompleted > 1 ? "s" : "",
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs ${learner.status === "inactif" ? "text-destructive font-medium" : "text-muted-foreground"}`,
                    children: relativeTime(learner.lastActivity)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-[100px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Progress,
                    {
                      value: learner.avgProgress,
                      className: "h-1.5 flex-1"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-foreground w-8 text-right", children: [
                    learner.avgProgress,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_BADGE[learner.status].className}`,
                    children: STATUS_BADGE[learner.status].label
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "text-xs h-7 px-2",
                    onClick: (e) => {
                      e.stopPropagation();
                      setSelectedLearner(learner);
                    },
                    "data-ocid": `admin_learners.detail_button.${idx + 1}`,
                    children: "Détails"
                  }
                ) })
              ]
            },
            learner.learnerId
          )) })
        ] }) }) })
      ] })
    ] }),
    selectedLearner && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LearnerDetailDrawer,
      {
        learner: selectedLearner,
        onClose: () => setSelectedLearner(null)
      }
    )
  ] }) });
}
export {
  AdminLearnersPage as default
};
