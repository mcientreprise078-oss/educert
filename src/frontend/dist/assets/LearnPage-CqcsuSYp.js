import { c as createLucideIcon, r as reactExports, F as useGetTutorHistory, H as useAskTutor, J as useClearTutorHistory, j as jsxRuntimeExports, v as BookOpen, T as Trash2, K as CircleAlert, e as Button, h as ue, M as useDirection, N as useControllableState, R as Root, O as Primitive, Q as useComposedRefs, V as Item, W as composeEventHandlers, X as createRovingFocusGroupScope, Y as Presence, Z as createContextScope, _ as useSize, q as cn, u as useNavigate, l as useParams, m as useGetCourse, o as useGetCourseLessons, n as useGetEnrollment, $ as useMarkLessonComplete, p as Link, x as Separator, P as ProgressBar, B as Badge, w as CircleCheckBig, a0 as ScrollArea, f as LoadingSpinner, a1 as LoaderCircle, a2 as ArrowRight, a3 as useGenerateChapterQuiz } from "./index-D09cs5UV.js";
import { T as Textarea } from "./textarea-C0s8ETpx.js";
import { S as Send } from "./send-C8jMAb4x.js";
import { u as usePrevious } from "./index-CG-zuoud.js";
import { X } from "./x-DU9MTTQ_.js";
import { A as ArrowLeft } from "./arrow-left-DCRm8SOu.js";
import { C as ChevronRight } from "./chevron-right-DTTFnz_N.js";
import { T as Trophy } from "./trophy-DASPV7aQ.js";
import { C as CircleX } from "./circle-x-Bb-Z_XDj.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polygon", { points: "10 8 16 12 10 16 10 8", key: "1cimsy" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m3 17 2 2 4-4", key: "1jhpwq" }],
  ["path", { d: "m3 7 2 2 4-4", key: "1obspn" }],
  ["path", { d: "M13 6h8", key: "15sg57" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 18h8", key: "oe0vm4" }]
];
const ListChecks = createLucideIcon("list-checks", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
function TypingIndicator() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 mb-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3.5 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/50 border border-border rounded-2xl rounded-bl-sm px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "size-1.5 rounded-full bg-muted-foreground/60 animate-bounce",
        style: { animationDelay: `${i * 0.15}s` }
      },
      i
    )) }) })
  ] });
}
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`,
      children: [
        !isUser && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted/50 border border-border text-foreground rounded-bl-sm"}`,
            children: msg.content
          }
        )
      ]
    }
  );
}
function TutorChat({
  courseId,
  lessonId,
  lessonTitle,
  lessonContentExcerpt
}) {
  const [question, setQuestion] = reactExports.useState("");
  const scrollAreaRef = reactExports.useRef(null);
  const textareaRef = reactExports.useRef(null);
  const { data: history = [], isLoading } = useGetTutorHistory(courseId);
  const askTutor = useAskTutor();
  const clearHistory = useClearTutorHistory();
  reactExports.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);
  async function handleSend() {
    const q = question.trim();
    if (!q || askTutor.isPending) return;
    setQuestion("");
    try {
      await askTutor.mutateAsync({
        courseId,
        lessonId,
        question: q,
        lessonContext: lessonContentExcerpt
      });
    } catch {
      ue.error("Erreur de connexion au tuteur. Réessayez.");
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }
  async function handleClear() {
    try {
      await clearHistory.mutateAsync(courseId);
    } catch {
      ue.error("Impossible d'effacer la conversation.");
    }
  }
  const isEmpty = !isLoading && history.length === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-card", "data-ocid": "tutor_chat.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-7 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3.5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground leading-tight", children: "Tuteur IA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: lessonTitle })
      ] }),
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleClear,
          disabled: clearHistory.isPending,
          className: "p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
          "aria-label": "Effacer la conversation",
          "data-ocid": "tutor_chat.clear_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: scrollAreaRef, className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" }),
        "Chargement…"
      ] }) }) : isEmpty ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center text-center py-8 px-4",
          "data-ocid": "tutor_chat.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-6 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground mb-1", children: "Votre tuteur IA est prêt" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Posez vos questions à votre tuteur IA — il répondra comme un professeur d'université" })
          ]
        }
      ) : history.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(MessageBubble, { msg }, msg.id.toString())),
      askTutor.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(TypingIndicator, {}),
      askTutor.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 text-destructive text-xs py-2 px-3 bg-destructive/5 rounded-lg mb-2",
          "data-ocid": "tutor_chat.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3.5 shrink-0" }),
            "Erreur de connexion au tuteur. Réessayez."
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-t border-border bg-background shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            ref: textareaRef,
            value: question,
            onChange: (e) => setQuestion(e.target.value),
            onKeyDown: handleKeyDown,
            placeholder: "Posez votre question…",
            className: "resize-none text-sm min-h-[44px] max-h-[120px] bg-input",
            rows: 1,
            disabled: askTutor.isPending,
            "data-ocid": "tutor_chat.input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "icon",
            onClick: handleSend,
            disabled: !question.trim() || askTutor.isPending,
            className: "shrink-0 size-[44px]",
            "data-ocid": "tutor_chat.send_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
          }
        )
      ] }),
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleClear,
          className: "mt-2 text-[11px] text-muted-foreground hover:text-destructive transition-colors w-full text-center",
          "data-ocid": "tutor_chat.clear_link",
          children: "Effacer la conversation"
        }
      )
    ] })
  ] });
}
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck == null ? void 0 : onCheck();
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = reactExports.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RadioGroupProvider,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              var _a;
              if (isArrowKeyPressedRef.current) (_a = ref.current) == null ? void 0 : _a.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`;
}
function parseBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map(
    (part, i) => i % 2 === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: part }, `b-${part}`) : part
  );
}
function LessonContent({ content }) {
  const lines = content.split("\n");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 text-foreground", children: lines.map((line, i) => {
    const key = `line-${i}-${line.slice(0, 20)}`;
    const imgMatch = line.match(/^\[IMAGE:\s*(.+?)\]$/);
    if (imgMatch) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: imgMatch[1],
          alt: "Illustration du cours",
          className: "rounded-lg max-w-full my-3 border border-border"
        },
        key
      );
    }
    const vidMatch = line.match(/^\[VIDEO:\s*([\w-]+)\]$/);
    if (vidMatch) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "relative w-full aspect-video rounded-xl overflow-hidden border border-border my-4",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "iframe",
            {
              src: `https://www.youtube.com/embed/${vidMatch[1]}`,
              title: "Vidéo du cours",
              allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
              allowFullScreen: true,
              className: "absolute inset-0 w-full h-full"
            }
          )
        },
        key
      );
    }
    if (line.startsWith("## ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h2",
        {
          className: "font-display font-bold text-xl text-foreground mt-6 mb-2",
          children: line.slice(3)
        },
        key
      );
    }
    if (line.startsWith("### ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "h3",
        {
          className: "font-display font-semibold text-base text-foreground mt-4 mb-1",
          children: line.slice(4)
        },
        key
      );
    }
    if (line.startsWith("```")) return null;
    if (line.startsWith("> ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "blockquote",
        {
          className: "border-l-4 border-primary/40 pl-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r-lg",
          children: parseBold(line.slice(2))
        },
        key
      );
    }
    if (line.match(/^\d+\. /)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "ml-5 text-muted-foreground list-decimal", children: parseBold(line.replace(/^\d+\. /, "")) }, key);
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "ml-5 text-muted-foreground list-disc", children: parseBold(line.slice(2)) }, key);
    }
    if (line.trim() === "") return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2" }, key);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: parseBold(line) }, key);
  }) });
}
function AIQuizSection({
  courseId,
  lessonId,
  lessonContent,
  onComplete
}) {
  const generateQuiz = useGenerateChapterQuiz();
  const [quiz, setQuiz] = reactExports.useState(null);
  const [answers, setAnswers] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(null);
  const [showExplanations, setShowExplanations] = reactExports.useState(false);
  lessonId.toString();
  reactExports.useEffect(() => {
    setQuiz(null);
    setAnswers([]);
    setScore(null);
    setShowExplanations(false);
    generateQuiz.mutateAsync({ courseId, lessonId, lessonContent }).then((result) => {
      try {
        setQuiz(JSON.parse(result));
      } catch {
      }
    }).catch(() => {
    });
  }, [lessonId, courseId, lessonContent, generateQuiz.mutateAsync]);
  if (generateQuiz.isPending || !quiz && !generateQuiz.isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mt-8 border border-border rounded-xl p-6 flex flex-col items-center gap-3",
        "data-ocid": "learn.ai_quiz.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 text-primary animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Génération du quiz par l'IA…" })
        ]
      }
    );
  }
  if (generateQuiz.isError || !quiz) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mt-8 border border-destructive/30 rounded-xl p-5 bg-destructive/5",
        "data-ocid": "learn.ai_quiz.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: "Impossible de générer le quiz pour ce chapitre." })
      }
    );
  }
  const passed = score !== null && score >= quiz.passingScore;
  const allAnswered = answers.length === quiz.questions.length && answers.every((a) => a !== void 0 && a !== null);
  function handleSubmit() {
    if (!quiz) return;
    const correct = quiz.questions.reduce(
      (cnt, q, i) => answers[i] === q.correctIndex ? cnt + 1 : cnt,
      0
    );
    const s = Math.round(correct / Math.max(1, quiz.questions.length) * 100);
    setScore(s);
    setShowExplanations(true);
    if (s >= quiz.passingScore) onComplete();
  }
  function handleRetake() {
    setScore(null);
    setAnswers([]);
    setShowExplanations(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mt-8 border border-border rounded-xl overflow-hidden",
      "data-ocid": "learn.ai_quiz.section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 px-5 py-4 flex items-center gap-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "size-5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Quiz du Chapitre" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              quiz.questions.length,
              " questions · Score minimum :",
              " ",
              quiz.passingScore,
              "%"
            ] })
          ] }),
          score !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "ml-auto",
              variant: passed ? "default" : "destructive",
              children: passed ? `Réussi · ${score}%` : `Échoué · ${score}%`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-6", children: [
          quiz.questions.map((q, qi) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": `learn.ai_quiz.question.${qi + 1}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-foreground mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-sm mr-2", children: [
                  qi + 1,
                  "."
                ] }),
                q.text
              ] }),
              showExplanations ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = q.correctIndex === oi;
                  let cls = "flex items-center gap-3 p-3 rounded-lg border text-sm ";
                  if (isCorrect)
                    cls += "border-primary/40 bg-primary/5 text-foreground";
                  else if (isSelected && !isCorrect)
                    cls += "border-destructive/40 bg-destructive/5 text-muted-foreground line-through";
                  else cls += "border-border text-muted-foreground";
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cls, children: [
                    isCorrect ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4 text-primary shrink-0" }) : isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-4 text-destructive shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 rounded-full border border-border shrink-0" }),
                    opt
                  ] }, `${q.id}-opt-${oi}`);
                }),
                q.explanation && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-2 mt-1", children: [
                  "💡 ",
                  q.explanation
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                RadioGroup,
                {
                  value: ((_a = answers[qi]) == null ? void 0 : _a.toString()) ?? "",
                  onValueChange: (val) => {
                    const next = [...answers];
                    next[qi] = Number.parseInt(val);
                    setAnswers(next);
                  },
                  className: "space-y-2",
                  children: q.options.map((opt, oi) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer",
                      "data-ocid": `learn.ai_quiz.option.${qi + 1}.${oi + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          RadioGroupItem,
                          {
                            value: oi.toString(),
                            id: `aiq${qi}-o${oi}`
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: `aiq${qi}-o${oi}`,
                            className: "text-sm text-muted-foreground cursor-pointer flex-1",
                            children: opt
                          }
                        )
                      ]
                    },
                    `${q.id}-opt-${oi}`
                  ))
                }
              )
            ] }, q.id);
          }),
          score !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex items-center gap-2 font-semibold ${passed ? "text-primary" : "text-destructive"}`,
                children: passed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-5" }),
                  " Félicitations ! Leçon validée."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-5" }),
                  " Score insuffisant — réessayez."
                ] })
              }
            ),
            !passed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    var _a;
                    return (_a = document.getElementById("lesson-content-top")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                  },
                  "data-ocid": "learn.ai_quiz.reread_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-3.5 mr-1.5" }),
                    "Relire le chapitre"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: handleRetake,
                  "data-ocid": "learn.ai_quiz.retake_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-3.5 mr-1.5" }),
                    "Réessayer"
                  ]
                }
              )
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSubmit,
              disabled: !allAnswered,
              className: "w-full",
              "data-ocid": "learn.ai_quiz.submit_button",
              children: "Soumettre les réponses"
            }
          )
        ] })
      ]
    }
  );
}
function LearnPage() {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams({
    from: "/learn/$courseId/$lessonId"
  });
  const { data: course } = useGetCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } = useGetCourseLessons(courseId);
  const { data: enrollment } = useGetEnrollment(courseId);
  const markComplete = useMarkLessonComplete();
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const currentLesson = lessons[currentIndex] ?? lessons[0];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const completedLessons = (enrollment == null ? void 0 : enrollment.completedLessons) ?? [];
  const isCurrentComplete = currentLesson ? completedLessons.includes(currentLesson.id) : false;
  const progress = lessons.length > 0 ? Math.round(completedLessons.length / lessons.length * 100) : (enrollment == null ? void 0 : enrollment.progress) ?? 0;
  const [markLoading, setMarkLoading] = reactExports.useState(false);
  const [tutorOpen, setTutorOpen] = reactExports.useState(false);
  const [quizPassed, setQuizPassed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setQuizPassed(false);
  }, []);
  async function handleMarkComplete() {
    if (!currentLesson || isCurrentComplete) return;
    setMarkLoading(true);
    try {
      await markComplete.mutateAsync({
        courseId,
        lessonId: currentLesson.id,
        totalLessons: lessons.length
      });
    } finally {
      setMarkLoading(false);
    }
  }
  function handleQuizComplete() {
    setQuizPassed(true);
    if (!currentLesson || isCurrentComplete) return;
    markComplete.mutate({
      courseId,
      lessonId: currentLesson.id,
      totalLessons: lessons.length
    });
  }
  const courseIdStr = courseId ?? "0";
  const lessonIdStr = (currentLesson == null ? void 0 : currentLesson.id) ?? lessonId ?? "l1";
  const lessonContentExcerpt = ((currentLesson == null ? void 0 : currentLesson.content) ?? "").slice(0, 500);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "learn.page",
      children: [
        tutorOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "fixed inset-0 z-50 flex flex-col lg:hidden",
            "data-ocid": "tutor_chat.mobile_drawer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute inset-0 bg-black/50",
                  onClick: () => setTutorOpen(false),
                  "aria-label": "Fermer le tuteur"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 right-0 h-[70vh] bg-card rounded-t-2xl border-t border-border flex flex-col overflow-hidden shadow-2xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-foreground", children: "Tuteur IA" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setTutorOpen(false),
                      className: "p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors",
                      "aria-label": "Fermer",
                      "data-ocid": "tutor_chat.close_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TutorChat,
                  {
                    courseId: courseIdStr,
                    lessonId: lessonIdStr,
                    lessonTitle: (currentLesson == null ? void 0 : currentLesson.title) ?? "",
                    lessonContentExcerpt
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-card border-b border-border px-4 py-3 flex items-center gap-4 sticky top-0 z-40 shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "ghost",
              size: "sm",
              className: "shrink-0",
              "data-ocid": "learn.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/courses/$courseId", params: { courseId }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline max-w-48 truncate", children: (course == null ? void 0 : course.title) ?? "Formation" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-5 hidden sm:block" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 max-w-sm hidden sm:flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProgressBar,
              {
                value: progress,
                showLabel: false,
                className: "flex-1 h-2"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground whitespace-nowrap font-medium", children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
            isCurrentComplete && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-primary border-primary/30 bg-primary/5 text-xs hidden sm:flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-3" }),
                  "Complétée"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: tutorOpen ? "default" : "outline",
                size: "sm",
                onClick: () => setTutorOpen((v) => !v),
                className: "flex items-center gap-1.5 text-xs",
                "data-ocid": "learn.tutor_toggle_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Tuteur IA" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", style: { minHeight: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "aside",
            {
              className: "hidden lg:flex flex-col w-72 bg-card border-r border-border shrink-0",
              "data-ocid": "learn.sidebar",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground mb-0.5", children: "Programme du cours" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    completedLessons.length,
                    "/",
                    lessons.length,
                    " leçons terminées"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-3 space-y-0.5", children: lessonsLoading ? ["skel-1", "skel-2", "skel-3", "skel-4", "skel-5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-10 bg-muted/30 rounded-lg animate-pulse mb-1"
                  },
                  k
                )) : lessons.map((lesson, i) => {
                  const isDone = completedLessons.includes(lesson.id);
                  const isCurrent = lesson.id === (currentLesson == null ? void 0 : currentLesson.id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/learn/$courseId/$lessonId",
                      params: { courseId, lessonId: lesson.id },
                      className: `flex items-center gap-3 p-2.5 rounded-lg text-sm transition-smooth ${isCurrent ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
                      "data-ocid": `learn.lesson_nav.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4 text-primary" }) : isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "size-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-4 rounded-full border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold", children: i + 1 }) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2 leading-tight", children: lesson.title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-60 block mt-0.5", children: formatDuration(lesson.duration) })
                        ] }),
                        isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-3.5 shrink-0 opacity-60" })
                      ]
                    },
                    lesson.id
                  );
                }) }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto min-w-0", children: lessonsLoading || !currentLesson ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            currentLesson.videoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-black w-full aspect-video flex items-center justify-center max-h-[55vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "video",
              {
                controls: true,
                className: "w-full h-full object-contain",
                src: currentLesson.videoUrl,
                "data-ocid": "learn.video_player",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
              }
            ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 w-full border-b border-border flex flex-col items-center justify-center py-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-primary/10 p-5 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-10 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Leçon textuelle" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                id: "lesson-content-top",
                className: "max-w-3xl mx-auto w-full px-6 py-8 space-y-8",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "Leçon ",
                        currentIndex + 1,
                        " sur ",
                        lessons.length
                      ] }),
                      isCurrentComplete && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-primary border-primary/30 bg-primary/5 text-xs flex items-center gap-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-3" }),
                            " Complétée"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl md:text-3xl text-foreground", children: currentLesson.title }),
                    currentLesson.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2", children: currentLesson.description })
                  ] }),
                  currentLesson.content && /* @__PURE__ */ jsxRuntimeExports.jsx(LessonContent, { content: currentLesson.content }),
                  currentLesson.content && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AIQuizSection,
                    {
                      courseId: courseIdStr,
                      lessonId: lessonIdStr,
                      lessonContent: currentLesson.content,
                      onComplete: handleQuizComplete
                    }
                  ),
                  !isCurrentComplete && quizPassed && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      onClick: handleMarkComplete,
                      disabled: markLoading,
                      className: "w-full sm:w-auto",
                      "data-ocid": "learn.mark_complete_button",
                      children: markLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 mr-2 animate-spin" }),
                        "Enregistrement…"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4 mr-2" }),
                        "Marquer comme terminée"
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between",
                      "data-ocid": "learn.navigation",
                      children: [
                        prevLesson ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            asChild: true,
                            variant: "outline",
                            "data-ocid": "learn.prev_lesson_button",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Link,
                              {
                                to: "/learn/$courseId/$lessonId",
                                params: { courseId, lessonId: prevLesson.id },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4 mr-1.5" }),
                                  "Précédent"
                                ]
                              }
                            )
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                        nextLesson ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, "data-ocid": "learn.next_lesson_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Link,
                          {
                            to: "/learn/$courseId/$lessonId",
                            params: { courseId, lessonId: nextLesson.id },
                            children: [
                              "Suivant",
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4 ml-1.5" })
                            ]
                          }
                        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            type: "button",
                            onClick: () => navigate({ to: "/certificates" }),
                            className: "bg-accent text-accent-foreground hover:bg-accent/90",
                            "data-ocid": "learn.finish_button",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-4 mr-1.5" }),
                              "Voir mes certificats"
                            ]
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            )
          ] }) }),
          tutorOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "aside",
            {
              className: "hidden lg:flex flex-col w-80 bg-card border-l border-border shrink-0",
              "data-ocid": "learn.tutor_sidebar",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TutorChat,
                {
                  courseId: courseIdStr,
                  lessonId: lessonIdStr,
                  lessonTitle: (currentLesson == null ? void 0 : currentLesson.title) ?? "",
                  lessonContentExcerpt
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
export {
  LearnPage as default
};
