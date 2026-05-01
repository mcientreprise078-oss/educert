import { r as reactExports } from "./index-Duog9_D-.js";
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
export {
  clamp as c,
  usePrevious as u
};
