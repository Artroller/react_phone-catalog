export function getAssetUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, '');

  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
