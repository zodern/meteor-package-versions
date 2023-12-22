Package.describe({
  summary: 'Build plugin to provide list of packages and their versions used by the app',
  version: '0.2.2',
  name: 'zodern:meteor-package-versions',
  git: 'https://github.com/zodern/meteor-package-versions.git'
});

Package.registerBuildPlugin({
  name: 'package-versions-compiler',
  sources: [
    './plugin.js'
  ],
});

Package.onUse(api => {
  api.use('isobuild:compiler-plugin@1.0.0')
  api.versionsFrom('METEOR@1.4');
  api.imply('modules');
});
