import { useEffect, useState } from "react";

type InitialState<T> = T | (() => T)

/**
 * memoize a value that depends on asynchronous computation.
 * 
 * @warning
 * this hook expects the callback to never change.
 * if the callback updates and you need the hook to update as well,
 * explicitly add the callback to the dependency array
 */
export function useAsyncMemo<T, I>(
  callback: () => (T | Promise<T>),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[],
  initial: InitialState<I>
): I | T {
  const [state, set] = useState<T | I>(initial)
  useEffect(() => {
    async function run() {
      set(await callback())
    }

    void run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}