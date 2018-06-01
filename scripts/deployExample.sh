PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

./node_modules/gh-pages/bin/gh-pages.js \
  -d example/ \
  -s '{index.html,package-example.js,assets/*}' \
  -m "v${PACKAGE_VERSION}"
