/** Trip days in URLs and CLI use 1–12 (Jul 1 = day 1). Arrays stay 0-indexed internally. */

export const TRIP_DAY_COUNT = 12

/** URL / CLI day number (1–12) → internal array index (0–11). */
export function urlDayToInternal(dayNum: number): number | null {
  if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > TRIP_DAY_COUNT) return null
  return dayNum - 1
}

/** Internal array index (0–11) → URL day number (1–12). */
export function internalToUrlDay(internalIndex: number): number {
  return internalIndex + 1
}

/** Parse `/day/:index` route param → internal index, or null if invalid. */
export function parseUrlDayParam(param: string | undefined): number | null {
  if (param == null || param === '') return null
  const n = Number(param)
  if (!Number.isInteger(n)) return null
  return urlDayToInternal(n)
}
