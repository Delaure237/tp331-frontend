import * as React from "react";
import { useCallbackRef } from "@/hooks/use-callback-ref";

type Options = {
  leading?: boolean;
  trailing?: boolean;
};

/**
 * Hook `useDebouncedCallback` :
 * Retourne une version *debounced* (anti-rebond) de la fonction passée en argument.
 *
 * @param callback - La fonction à exécuter avec délai
 * @param delay - Temps d’attente en millisecondes
 * @param options - Options `leading` et `trailing` (facultatives, `trailing: true` par défaut)
 *
 * @returns Une fonction debounced avec `.cancel()` et `.flush()`
 */
export function useDebouncedCallback<Args extends unknown[], R>(
  callback: (...args: Args) => R,
  delay: number,
  options: Options = { trailing: true },
): ((...args: Args) => void) & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true } = options;

  const callbackRef = useCallbackRef(callback);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = React.useRef<Args | null>(null);
  const isLeadingCalledRef = React.useRef(false);

  const cancel = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    isLeadingCalledRef.current = false;
    lastArgsRef.current = null;
  }, []);

  const flush = React.useCallback(() => {
    if (timeoutRef.current !== null && trailing && lastArgsRef.current !== null) {
      callbackRef(...lastArgsRef.current);
      cancel();
    }
  }, [trailing, callbackRef, cancel]);

  const debounced = React.useCallback(
    (...args: Args) => {
      lastArgsRef.current = args;

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      if (leading && !isLeadingCalledRef.current) {
        callbackRef(...args);
        isLeadingCalledRef.current = true;
      }

      timeoutRef.current = setTimeout(() => {
        if (trailing && (!leading || isLeadingCalledRef.current)) {
          if (lastArgsRef.current !== null) {
            callbackRef(...lastArgsRef.current);
          }
        }
        cancel();
      }, delay);
    },
    [callbackRef, delay, leading, trailing, cancel],
  );

  React.useEffect(() => cancel, [cancel]);

  const debouncedWithControl = React.useMemo(() => {
    const func = debounced as ((...args: Args) => void) & { cancel: () => void; flush: () => void };
    func.cancel = cancel;
    func.flush = flush;
    return func;
  }, [debounced, cancel, flush]);

  return debouncedWithControl;
}
