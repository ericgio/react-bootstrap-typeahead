export default function mapClassNamesToCssModules(
  classNames = '',
  cssModules
) {
  if (!cssModules) return classNames;
  return classNames
    .split(' ')
    .map((className) => cssModules[className] || className)
    .join(' ');
}
