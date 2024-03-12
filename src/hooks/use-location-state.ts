import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function useLocationState<State extends Record<string, unknown>>(
  validate: (state: Record<string, unknown>) => state is State,
): State | null {
  const location = useLocation()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const state = location.state
  const resolvedState = useMemo(
    () => {
      if (!state || typeof state !== 'object') { return null }
      return validate(state as Record<string, unknown>) ? state as State : null
    },
    [validate, state],
  )
  return resolvedState
}
