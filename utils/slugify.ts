// Lightweight kebab-case slugifier for URL segments.
// Strips diacritics, lowercases, replaces non-alnum runs with single dashes,
// and trims leading/trailing dashes.
export function kebabCase(input: string): string {
  if (!input) return ''
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Build a "<id>-<kebab-name>" URL slug for category links.
export function categorySlug(id: number | string, name?: string): string {
  const slugName = kebabCase(name || '')
  return slugName ? `${id}-${slugName}` : String(id)
}

// Extract the numeric id from a category slug like "12-comedy" or "12".
export function parseCategorySlug(slug: string): string {
  if (!slug) return ''
  const first = String(slug).split('-')[0]
  return /^\d+$/.test(first) ? first : ''
}
