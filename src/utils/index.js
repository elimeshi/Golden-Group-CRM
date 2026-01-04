export function createPageUrl(pageName = '') {
  // normalize: remove extra spaces, lowercase, replace spaces with dashes
  const slug = String(pageName).trim().replace(/\s+/g, '-').toLowerCase();
  return `/${encodeURIComponent(slug)}`;
}