# zodern:meteor-package-versions

A simple compiler which allows importing files named `.meteor-package-versions` to get an object containing the packages used by the app and their versions.

Compatible with Meteor 1.4 and newer.

1. Add the package with `meteor add zodern:meteor-package-versions`
2. Create a file named `.meteor-package-versions`. The content doesn't matter.
3. Import the file and use it

```js
import packages from './.meteor-package-versions';

console.dir(packages);
/*
  Outputs:
  { 'allow-deny': '1.1.0',
  autopublish: '1.0.7',
  autoupdate: '1.4.1',
  'babel-compiler': '7.1.1',
  'babel-runtime': '1.2.7',
  base64: '1.0.11',
  'binary-heap': '1.0.10',
  blaze: '2.3.3',
  'blaze-html-templates': '1.1.2',
  'blaze-tools': '1.0.10',
  ...
  }
```

If the .meteor/versions file does not exist (such as when running `meteor test-packages`), the exported object will instead look like

```js
{
  __errorRetrievingVersions: true
}
```
