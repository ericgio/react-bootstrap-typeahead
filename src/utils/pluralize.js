/**
 * Basic util for pluralizing words. By default, simply adds an 's' to the word.
 * Also allows for a custom plural version.
 */
export default function pluralize(text, count, plural) {
  plural = plural || `${text}s`;
  return count === 1 ? `1 ${text}` : `${count} ${plural}`;
}
