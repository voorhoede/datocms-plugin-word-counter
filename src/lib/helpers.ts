export function objectsAreEqual(a: any, b: any): boolean {
  const srt = (obj: any) => JSON.stringify(obj)?.split('').sort().join('')
  return srt(a) === srt(b)
}
