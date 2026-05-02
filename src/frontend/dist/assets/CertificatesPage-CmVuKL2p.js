import { c as createLucideIcon, r as reactExports, M as useDirection, N as useControllableState, j as jsxRuntimeExports, O as Primitive, a4 as useId, R as Root, V as Item, W as composeEventHandlers, Y as Presence, X as createRovingFocusGroupScope, Z as createContextScope, q as cn, u as useNavigate, a5 as useGetCertificates, a6 as useListDomains, L as Layout, E as Award, t as Clock, e as Button, a7 as Shield, B as Badge, a8 as User, S as Star, v as BookOpen, a9 as ChevronDown, h as ue } from "./index-D09cs5UV.js";
import { S as Skeleton } from "./skeleton-mMnzhBic.js";
import { T as Trophy } from "./trophy-DASPV7aQ.js";
import { C as CircleCheck } from "./circle-check-DuoBvN5I.js";
import { C as Crown } from "./crown-CzuuUfNc.js";
import { C as Calendar, Q as QrCode } from "./qr-code-C7QvOsf6.js";
import { C as ChevronUp } from "./chevron-up-CGPOmjX1.js";
import { E as ExternalLink } from "./external-link-DO6HyzfZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function QRCodeVisual({
  payload,
  size = 80
}) {
  const cells = 7;
  const cell = size / cells;
  const grid = [];
  for (let r = 0; r < cells; r++) {
    grid[r] = [];
    for (let c = 0; c < cells; c++) {
      const idx = (r * cells + c) % payload.length;
      grid[r][c] = payload.charCodeAt(idx) % 2 === 0;
    }
  }
  const corners = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [2, 0],
    [1, 2],
    [2, 1],
    [2, 2],
    [0, cells - 1],
    [0, cells - 2],
    [0, cells - 3],
    [1, cells - 1],
    [2, cells - 1],
    [1, cells - 3],
    [2, cells - 2],
    [2, cells - 3],
    [cells - 1, 0],
    [cells - 2, 0],
    [cells - 3, 0],
    [cells - 1, 2],
    [cells - 2, 1],
    [cells - 3, 2],
    [cells - 3, 1],
    [cells - 1, 1]
  ];
  for (const [r, c] of corners) {
    if (r < cells && c < cells) grid[r][c] = true;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      xmlns: "http://www.w3.org/2000/svg",
      className: "rounded-sm",
      "aria-label": "QR Code de vérification",
      role: "img",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: size, height: size, fill: "white" }),
        grid.flatMap(
          (row, r) => row.map((filled, c) => filled ? { r, c } : null).filter((v) => v !== null)
        ).map(({ r, c }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: c * cell + 0.5,
            y: r * cell + 0.5,
            width: cell - 1,
            height: cell - 1,
            fill: "#1a237e"
          },
          `cell-r${r}-c${c}`
        ))
      ]
    }
  );
}
function generateMinistryPDF(cert) {
  const certUrl = `${window.location.origin}/verify/${encodeURIComponent(cert.qrCodePayload)}`;
  const citationsHtml = cert.resourceCitations.length > 0 ? `<div class="citations"><p class="label">Ressources académiques utilisées :</p><ul>${cert.resourceCitations.map((c) => `<li>${c}</li>`).join("")}</ul></div>` : "";
  const ministryApprovedHtml = cert.isMinistryApproved ? `<div class="ministry-seal">
        <p class="seal-title">✓ APPROUVÉ PAR LE MINISTÈRE</p>
        ${cert.ministryReviewerName ? `<p class="seal-reviewer">Réviseur : ${cert.ministryReviewerName}</p>` : ""}
        ${cert.approvedAt ? `<p class="seal-date">Date d'approbation : ${formatDate(cert.approvedAt)}</p>` : ""}
      </div>` : `<div class="ministry-pending"><p>En attente d'approbation ministérielle</p></div>`;
  const portraitHtml = cert.portfolioPhotoUrl ? `<img class="portrait" src="${cert.portfolioPhotoUrl}" alt="Photo de l'apprenant" />` : `<div class="portrait-placeholder"><span>👤</span></div>`;
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Certificat EDUCERT — ${cert.courseTitle}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  body { font-family: Georgia, "Times New Roman", serif; background: #fff; color: #1a1a3e; margin: 0; padding: 0; }
  .page { width: 277mm; min-height: 190mm; padding: 14mm 18mm; box-sizing: border-box; border: 6px solid #1a237e; position: relative; }
  .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 80px; color: rgba(26,35,126,0.04); font-weight: bold; pointer-events: none; white-space: nowrap; font-family: sans-serif; text-align: center; }
  .portrait { position: absolute; top: 14mm; right: 18mm; width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #c8a14a; box-shadow: 0 2px 8px rgba(26,35,126,0.15); }
  .portrait-placeholder { position: absolute; top: 14mm; right: 18mm; width: 80px; height: 80px; border-radius: 50%; background: #e8eaf6; border: 3px solid #c8a14a; display: flex; align-items: center; justify-content: center; font-size: 32px; }
  .header { text-align: center; border-bottom: 2px solid #c8a14a; padding-bottom: 8mm; margin-bottom: 8mm; padding-right: 90px; }
  .flag { font-size: 28px; margin-bottom: 3mm; }
  .ministry { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #1a237e; font-family: sans-serif; font-weight: 600; margin-bottom: 2mm; }
  .republic { font-size: 10px; color: #555; font-family: sans-serif; margin-bottom: 3mm; }
  h1 { font-size: 32px; color: #1a237e; margin: 0 0 1mm; letter-spacing: 4px; text-transform: uppercase; }
  .underline { width: 80mm; height: 2px; background: linear-gradient(to right, #1a237e, #c8a14a); margin: 3mm auto; }
  .body { text-align: center; }
  .presented-to { font-size: 13px; color: #666; font-style: italic; margin-bottom: 2mm; }
  .learner { font-size: 28px; font-weight: bold; color: #1a237e; margin: 3mm 0; border-bottom: 2px dotted #c8a14a; display: inline-block; padding-bottom: 2mm; }
  .completion { font-size: 13px; color: #444; margin-bottom: 2mm; }
  .course { font-size: 18px; font-style: italic; color: #1a237e; margin: 3mm 0; max-width: 160mm; margin-left: auto; margin-right: auto; font-weight: 600; }
  .instructor { font-size: 12px; color: #555; margin-bottom: 5mm; }
  .meta { display: flex; justify-content: space-around; margin-top: 8mm; padding-top: 4mm; border-top: 1px solid #e5e5e5; }
  .meta-item { text-align: center; }
  .meta-item label { display: block; font-size: 9px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #c8a14a; margin-bottom: 1mm; font-family: sans-serif; }
  .meta-item span { font-size: 11px; color: #333; }
  .ministry-seal { background: #e8f5e9; border: 1px solid #2e7d32; border-radius: 4px; padding: 3mm 5mm; margin-top: 4mm; text-align: center; }
  .seal-title { font-size: 11px; font-weight: bold; color: #1b5e20; margin: 0 0 1mm; font-family: sans-serif; }
  .seal-reviewer, .seal-date { font-size: 10px; color: #388e3c; margin: 0; font-family: sans-serif; }
  .ministry-pending { background: #fff3e0; border: 1px solid #e65100; border-radius: 4px; padding: 2mm 4mm; margin-top: 4mm; }
  .ministry-pending p { font-size: 10px; color: #e65100; margin: 0; font-family: sans-serif; }
  .citations { margin-top: 4mm; text-align: left; }
  .citations .label { font-size: 9px; font-weight: bold; text-transform: uppercase; color: #1a237e; font-family: sans-serif; margin-bottom: 1mm; }
  .citations ul { list-style: none; padding: 0; margin: 0; }
  .citations li { font-size: 9px; color: #555; padding: 0.5mm 0; }
  .citations li::before { content: "• "; color: #c8a14a; }
  .verify { font-size: 9px; color: #aaa; text-align: center; margin-top: 5mm; font-family: sans-serif; }
  .vip-badge { display: inline-block; background: #fff8e1; border: 1px solid #f9a825; color: #e65100; font-size: 9px; font-family: sans-serif; font-weight: bold; padding: 1mm 3mm; border-radius: 3px; margin-bottom: 3mm; letter-spacing: 1px; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="page">
    <div class="watermark">ÉDUCATION CERTIFIÉE RDC</div>
    ${portraitHtml}
    <div class="header">
      <div class="flag">🇨🇩</div>
      <div class="republic">République Démocratique du Congo</div>
      <div class="ministry">Ministère de la Formation Professionnelle</div>
      <h1>Certificat de Réussite</h1>
      <div class="underline"></div>
    </div>
    <div class="body">
      <p class="presented-to">Ce certificat est décerné à</p>
      <div class="learner">${cert.learnerName}</div>
      <p class="completion">pour avoir complété avec succès la formation</p>
      <p class="course">${cert.courseTitle}</p>
      ${cert.instructor ? `<p class="instructor">Formateur : <strong>${cert.instructor}</strong></p>` : ""}
      ${ministryApprovedHtml}
      ${citationsHtml}
      <div class="meta">
        <div class="meta-item"><label>Date d'obtention</label><span>${formatDate(cert.issuedAt)}</span></div>
        <div class="meta-item"><label>Identifiant</label><span>${cert.id.toUpperCase()}</span></div>
        <div class="meta-item"><label>Vérification</label><span>${cert.qrCodePayload.slice(0, 24)}…</span></div>
        <div class="meta-item"><label>Plateforme</label><span>EDUCERT</span></div>
      </div>
      <div class="verify">Vérification : ${certUrl}</div>
    </div>
  </div>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (win) {
    win.addEventListener("load", () => {
      win.print();
      URL.revokeObjectURL(url);
    });
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificat-educert-${cert.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
function CertificateCard({
  cert,
  index,
  isVip
}) {
  const [citationsOpen, setCitationsOpen] = reactExports.useState(false);
  function handleDownload() {
    generateMinistryPDF(cert);
    ue.success("Génération du certificat en cours…");
  }
  function handleShare() {
    const link = `${window.location.origin}/verify/${encodeURIComponent(cert.qrCodePayload)}`;
    navigator.clipboard.writeText(link).then(() => {
      ue.success("Lien de vérification copié !");
    });
  }
  function handleVerify() {
    window.open(`/verify/${encodeURIComponent(cert.qrCodePayload)}`, "_blank");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: "bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-smooth flex flex-col",
      "data-ocid": `certificates.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gradient-ministry px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", "aria-hidden": "true", children: "🇨🇩" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/90 text-[10px] font-semibold tracking-widest uppercase leading-none", children: "Ministère de la Formation Professionnelle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/70 text-[9px] tracking-wide leading-none mt-0.5", children: "République Démocratique du Congo — EDUCERT" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            isVip && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                className: "bg-amber-400/25 text-amber-100 border-0 text-[10px] gap-1",
                "data-ocid": `certificates.vip_badge.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "size-3" }),
                  "VIP Premium"
                ]
              }
            ),
            cert.isMinistryApproved ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                className: "bg-white/20 text-white border-0 text-[10px] gap-1",
                "data-ocid": `certificates.approved_badge.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }),
                  "Approuvé"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                className: "bg-amber-500/30 text-amber-100 border-0 text-[10px] gap-1",
                "data-ocid": `certificates.pending_badge.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
                  "En attente"
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-4 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-primary/10 p-3 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-display font-bold text-foreground text-base leading-tight line-clamp-2",
                  title: cert.courseTitle,
                  children: cert.courseTitle
                }
              ),
              cert.instructor && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                "Formateur : ",
                cert.instructor
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: cert.portfolioPhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: cert.portfolioPhotoUrl,
                alt: "Portrait de l'apprenant",
                className: "size-14 rounded-full object-cover border-2 border-accent/40 shadow-sm"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-muted/60 border-2 border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-6 text-muted-foreground" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 rounded-xl p-3 space-y-2.5 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-3.5" }),
                "Apprenant"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: cert.learnerName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5" }),
                "Date d'obtention"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: formatDate(cert.issuedAt) })
            ] }),
            cert.isMinistryApproved && cert.ministryReviewerName && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-3.5" }),
                  "Réviseur ministériel"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-right max-w-[140px] truncate", children: cert.ministryReviewerName })
              ] })
            ] })
          ] }),
          isVip && !cert.isMinistryApproved && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 bg-amber-500/8 border border-amber-400/30 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-4 text-amber-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-amber-700", children: "En attente d'approbation Premium" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-600/70", children: "Domaine VIP — validation manuelle par l'administrateur" })
            ] })
          ] }),
          cert.isMinistryApproved ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 bg-primary/8 border border-primary/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-primary shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-primary", children: "Approuvé par le Ministère" }),
              cert.approvedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-primary/70", children: [
                "le ",
                formatDate(cert.approvedAt)
              ] })
            ] })
          ] }) : !isVip ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 bg-accent/8 border border-accent/20 rounded-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-accent shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-accent", children: "En attente d'approbation ministérielle" })
          ] }) : null,
          cert.resourceCitations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border rounded-xl overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setCitationsOpen((v) => !v),
                className: "w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-foreground bg-muted/30 hover:bg-muted/60 transition-colors",
                "aria-expanded": citationsOpen,
                "data-ocid": `certificates.citations_toggle.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3.5 text-primary" }),
                    "Ressources utilisées (",
                    cert.resourceCitations.length,
                    ")"
                  ] }),
                  citationsOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-3.5 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-3.5 text-muted-foreground" })
                ]
              }
            ),
            citationsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "px-3 py-2 space-y-1.5 bg-muted/10", children: cert.resourceCitations.map((citation) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "text-[11px] text-muted-foreground flex items-start gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary mt-0.5 shrink-0", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: citation })
                ]
              },
              citation
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-3 bg-muted/30 rounded-xl border border-dashed border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-2 border-border rounded-md overflow-hidden shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeVisual, { payload: cert.qrCodePayload, size: 68 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "size-3" }),
                "Code de vérification"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-foreground break-all mt-0.5 leading-tight", children: cert.qrCodePayload })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-auto pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "flex-1 text-xs gap-1.5",
                onClick: handleDownload,
                "data-ocid": `certificates.download_button.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-3.5" }),
                  "Télécharger PDF"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "gap-1.5 text-xs",
                onClick: handleShare,
                "data-ocid": `certificates.share_button.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-3.5" }),
                  "Partager"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "gap-1.5 text-xs",
                onClick: handleVerify,
                "aria-label": "Vérifier ce certificat",
                "data-ocid": `certificates.verify_button.${index}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" }),
                  "Vérifier"
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CertificatesGrid({
  certs,
  emptyMessage,
  emptyIcon: EmptyIcon,
  domains
}) {
  const vipDomainNames = domains.filter((d) => d.tier === "vip").map((d) => d.name.toLowerCase());
  function isVipCert(cert) {
    return vipDomainNames.some(
      (name) => cert.courseTitle.toLowerCase().includes(name)
    );
  }
  if (certs.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "certificates.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-muted/50 p-5 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyIcon, { className: "size-10 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-base", children: emptyMessage }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-sm", children: "Complétez une formation pour obtenir votre certificat." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid grid-cols-1 md:grid-cols-2 gap-5",
      "data-ocid": "certificates.list",
      children: certs.map((cert, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CertificateCard,
        {
          cert,
          index: i + 1,
          isVip: isVipCert(cert)
        },
        cert.id
      ))
    }
  );
}
function LoadingSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid grid-cols-1 md:grid-cols-2 gap-5",
      "data-ocid": "certificates.loading_state",
      children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border rounded-2xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-12 rounded-xl shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-lg" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 flex-1 rounded-md" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-md" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-24 rounded-md" })
              ] })
            ] })
          ]
        },
        i
      ))
    }
  );
}
function CertificatesPage() {
  const navigate = useNavigate();
  const { data: certificates, isLoading } = useGetCertificates();
  const { data: domains = [] } = useListDomains();
  const approved = (certificates == null ? void 0 : certificates.filter((c) => c.isMinistryApproved)) ?? [];
  const pending = (certificates == null ? void 0 : certificates.filter((c) => !c.isMinistryApproved)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "certificates.page", className: "max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-xl gradient-ministry flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-5 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl text-foreground leading-none", children: [
          "Mes Certificats",
          !isLoading && certificates && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-base font-normal text-muted-foreground", children: [
            "(",
            certificates.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Certifications officielles — Ministère de la Formation Professionnelle, RDC" })
      ] })
    ] }) }),
    !isLoading && certificates && certificates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2.5 bg-primary/8 border border-primary/20 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-primary", children: [
          approved.length,
          " approuvé",
          approved.length > 1 ? "s" : "",
          " par le Ministère"
        ] })
      ] }),
      pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2.5 bg-accent/8 border border-accent/20 rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-accent", children: [
          pending.length,
          " en attente d'approbation"
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSkeleton, {}) : !(certificates == null ? void 0 : certificates.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-24 text-center",
        "data-ocid": "certificates.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl gradient-ministry p-5 mb-5 opacity-80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-12 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl text-foreground mb-2", children: "Aucun certificat pour l'instant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm mb-6", children: "Complétez une formation pour obtenir votre premier certificat officiel du Ministère de la Formation Professionnelle de la RDC." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => navigate({ to: "/catalog" }),
              "data-ocid": "certificates.explore_button",
              children: "Explorer les formations"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "approved", "data-ocid": "certificates.tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-6 h-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "approved",
            className: "gap-2",
            "data-ocid": "certificates.approved_tab",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3.5" }),
              "Certifiés par le Ministère",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-semibold", children: approved.length })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "pending",
            className: "gap-2",
            "data-ocid": "certificates.pending_tab",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5" }),
              "En attente d'approbation",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[10px] bg-accent/10 text-accent rounded-full px-1.5 py-0.5 font-semibold", children: pending.length })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "approved", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CertificatesGrid,
        {
          certs: approved,
          emptyMessage: "Aucun certificat approuvé",
          emptyIcon: Shield,
          domains
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "pending", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CertificatesGrid,
        {
          certs: pending,
          emptyMessage: "Aucun certificat en attente",
          emptyIcon: Clock,
          domains
        }
      ) })
    ] })
  ] }) });
}
export {
  CertificatesPage as default
};
