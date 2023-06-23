export function capitalize(str: string): string {
  let s = str.toLowerCase().trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
