export function getAssetUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.replace(/^\/+/, '');

  return `/react_phone-catalog/${cleanPath}`;
}
