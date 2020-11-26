Package.describe({
  name: 'igoandtag:tag-responsibles-module',
  version: '0.0.1',
  summary: 'Asignación de categoría y ubicación a usuario',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.1');
  api.use('react-template-helper');
  api.use('blaze-html-templates@1.0.4');
  api.use('react-meteor-data@0.2.16');
  api.use('ecmascript');
  api.use('templating');
  api.use('igoandsee:locations-collection');
  api.use('igoandsee:order-lists-module');
  api.use('igoandsee:tag-categories-collection');
  api.use('igoandtag:responsibles-collection');
  api.mainModule('tag-responsibles-module.js', 'client');
});

Npm.depends({
  'react' : '16.8.6',
  'react-table' : '6.10.0'
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('tag-responsibles-module');
  api.mainModule('tag-responsibles-module-tests.js');
});
