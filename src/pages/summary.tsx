import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DAY_SUMMARY_ROUTE,
  MONTH_SUMMARY_ROUTE,
  Route,
  WEEK_SUMMARY_ROUTE,
} from '@/routes.ts'
import { useSettings } from '@/db/actions.ts'

import type { Settings } from '@/db/types.ts'

const FALLBACK_DEFAULT_SUMMARY_ROUTE = DAY_SUMMARY_ROUTE

const DEFAULT_VIEW_TO_ROUTE: Record<Settings['defaultView'], Route> = {
  day: DAY_SUMMARY_ROUTE,
  week: WEEK_SUMMARY_ROUTE,
  month: MONTH_SUMMARY_ROUTE,
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
    const defaultView = settings?.defaultView

    // default view should always be in the mapping, but just in case
    if (
      Object.prototype.hasOwnProperty.call(DEFAULT_VIEW_TO_ROUTE, defaultView)
    ) {
      navigate(DEFAULT_VIEW_TO_ROUTE[defaultView])
      return
    }

    // fallback case
    navigate(FALLBACK_DEFAULT_SUMMARY_ROUTE)
  }, [settings, isLoadingData, navigate])

  return null
}
