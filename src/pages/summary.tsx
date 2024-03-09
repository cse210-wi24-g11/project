import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DAY_SUMMARY_ROUTE,
  Route,
  WEEK_SUMMARY_ROUTE,
} from '@/routes.ts'
import { useSettings } from '@/db/actions.ts'

import type { Settings } from '@/db/types.ts'

const DEFAULT_VIEW_TO_ROUTE: Record<Settings['defaultView'], Route> = {
  day: DAY_SUMMARY_ROUTE,
  week: WEEK_SUMMARY_ROUTE,
  lastVisited: DAY_SUMMARY_ROUTE,
}

export function Summary() {
  const navigate = useNavigate()

  const [settings, isLoadingData] = useSettings(null)

  useEffect(() => {
    // query has not resolved yet
    if (isLoadingData) {
      return
    }

    // settings should always be defined, this is just an extra sanity check, just in case
    const { defaultView, lastVisited } = settings ?? {}

    const target =
      defaultView === 'lastVisited' && lastVisited
        ? // if the default view is lastVisited and there is indeed a last visited, go to that view
          DEFAULT_VIEW_TO_ROUTE[lastVisited]
        : // otherwise go to whatever the default view is, or the default view for lastVisited when there is no last visited
          DEFAULT_VIEW_TO_ROUTE[defaultView]

    navigate(target, { replace: true })
  }, [settings, isLoadingData, navigate])

  return null
}
