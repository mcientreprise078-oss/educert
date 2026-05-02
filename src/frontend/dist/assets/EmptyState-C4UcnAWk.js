import { j as jsxRuntimeExports, e as Button, q as cn } from "./index-D09cs5UV.js";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      ),
      "data-ocid": "empty_state",
      children: [
        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-muted p-4 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-8 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xl text-foreground mb-2", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-sm leading-relaxed mb-6", children: description }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: action.onClick,
            className: "bg-accent text-accent-foreground hover:bg-accent/90",
            "data-ocid": "empty_state.action_button",
            children: action.label
          }
        )
      ]
    }
  );
}
export {
  EmptyState as E
};
