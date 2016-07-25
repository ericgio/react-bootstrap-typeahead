var context = require.context('./test', true, /Spec$/);
context.keys().forEach(context);
