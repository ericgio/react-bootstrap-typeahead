/**
 * Basic util for pluralizing words. By default, simply adds an 's' to the word.
 * Also allows for a custom plural version.
 */
export default function pluralize(text, count, plural) {
  const pluralText = plural || `${text}s`;
  return `${count} ${count === 1 ? text : pluralText}`;
}
