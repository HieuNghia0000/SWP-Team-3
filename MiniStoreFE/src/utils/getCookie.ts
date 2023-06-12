export default function getCookie(
  cookieHeader: string | undefined | null,
  key: string
): string | null {
  const cookies: { [key: string]: string } = {};

  if (!cookieHeader) {
    return null;
  }

  // Parse the Cookie header and split into individual cookie key-value pairs
  const cookiePairs = cookieHeader.split(";");
  cookiePairs.forEach((pair) => {
    const [cookieKey, cookieValue] = pair.trim().split("=");
    cookies[cookieKey] = cookieValue;
  });

  return cookies[key] || null;
}
