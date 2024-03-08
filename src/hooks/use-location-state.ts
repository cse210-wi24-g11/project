import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useLocationState<State>(
  validate: (state: unknown) => state is State,
): State | null {
  const location = useLocation()
  // @ts-expect-error for whatever reason the type signature has the key `_state`, but it's supposed to be `state`
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const state = location.state
  const resolvedState = useMemo(
    () => (validate(state) ? state : null),
    [validate, state],
  )
  return resolvedState
}
