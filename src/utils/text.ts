export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

export function slugify(str?: string): string {
  if (!str) return "";

  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Humanize a string (convert slugs/underscores to readable text)
 */
export function humanize(content: string): string {
  return content
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .replace(/[_\s]+/g, ' ')
    .replace(/[-\s]+/g, ' ')
    .replace(/^[a-z]/, (m) => m.toUpperCase());
}


/**
 * Title case a string (capitalize first letter of each word)
 */
export function titleify(content: string): string {
  const humanized = humanize(content);
  return humanized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
