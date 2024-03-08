type A = string | false | undefined
type Arg = A | Arg[]

function _cls(a: Arg): string {
  if (typeof a === 'string') {
    return a
  }
  if (Array.isArray(a)) {
    return cls(...a)
  }
  return ''
}

/**
 * html class combiner
 */
export function cls(...args: Arg[]): string {
  let s,
    r = ''
  for (const a of args) {
    s = _cls(a)
    if (s.length > 0) {
      r = r ? `${r} ${s}` : `${r}${s}`
    }
  }
  return r
}
