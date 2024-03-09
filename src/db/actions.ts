import { db, useQuery } from './index.ts'
import { SETTINGS_KEY } from './constants.ts'

import type { Settings } from './types.ts'

export function useSettings<T>(initial?: T) {
  return useQuery(
    async (db) => {
      const settings = await db.settings.get(SETTINGS_KEY)
      // settings are populated on db initialization,
      // only ever get updated and not removed,
      // and use a stable, constant key.
      // as such we know that `get` should always be successful and return a value.
      return settings!
    },
    [],
    initial,
  )
}

/**
 * updates some subset of settings.
 *
 * see https://dexie.org/docs/Table/Table.update()#return-value for how to interpret the return value.
 */
export async function updateSettings(settings: Partial<Settings>) {
  return db.settings.update(SETTINGS_KEY, settings)
}
