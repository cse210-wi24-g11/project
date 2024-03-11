import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  DAY_SUMMARY_ROUTE,
  MONTH_SUMMARY_ROUTE,
  Route,
  WEEK_SUMMARY_ROUTE,
} from '@/routes.ts'
import { DbRecord, getSettings } from '@/utils/db.ts'

import { useDb } from '@/context/db.tsx'

const FALLBACK_DEFAULT_SUMMARY_ROUTE = DAY_SUMMARY_ROUTE

const DEFAULT_VIEW_TO_ROUTE: Record<
  DbRecord<'settings'>['defaultView'],
  Route
> = {
  day: DAY_SUMMARY_ROUTE,
  week: WEEK_SUMMARY_ROUTE,
  month: MONTH_SUMMARY_ROUTE,
  lastVisited: DAY_SUMMARY_ROUTE,
}

export function Summary() {
  const navigate = useNavigate()
  const { getDb, ready } = useDb()

  useEffect(() => {
    if (!ready) {
      navigate(FALLBACK_DEFAULT_SUMMARY_ROUTE)
      return
    }

    async function run() {
      const db = await getDb()
      const settings = await getSettings(db)
      if (settings.defaultView === 'lastVisited' && settings.lastVisited) {
        navigate(DEFAULT_VIEW_TO_ROUTE[settings.lastVisited], { replace: true })
      } else {
        navigate(DEFAULT_VIEW_TO_ROUTE[settings.defaultView], { replace: true })
      }
    }

    void run()
  }, [ready, getDb, navigate])

  return null
}
