var fs = Plugin.fs;

// Based on https://github.com/meteor/meteor/blob/d9db4f52f2ea6d706a25156768ea42e1fbb8f599/tools/utils/utils.js#L250
function parsePackageAndVersion(packageAtVersionString) {
  var separatorPos = Math.max(packageAtVersionString.lastIndexOf(' '),
    packageAtVersionString.lastIndexOf('@'));

  if (separatorPos < 0) {
    return;
  }

  var packageName = packageAtVersionString.slice(0, separatorPos);
  var version = packageAtVersionString.slice(separatorPos + 1);

  return { package: packageName, version: version };
}

// Meteor doesn't provide fs.exists, so we implement a simplified version ourselves
function exists(path) {
  try {
    return !!fs.statSync(path);
  } catch (e) {
    return false;
  }
}

function PackageVersionCompiler() { }

PackageVersionCompiler.prototype.processFilesForTarget = function (files) {
  var contents;
  try {
    contents = fs.readFileSync('./.meteor/versions', 'utf-8');
  } catch (e) {
    // Check if running for a package, such as `meteor test-packages`
    // In that case, there will never be a .meteor/versions file
    if (!exists('./package.js')) {
      console.log('package.js does not exist', process.cwd());
      console.error('zodern:meteor-package-versions: Unable to read .meteor/versions -', e.message);
    }

    files.forEach((file) => {
      file.addJavaScript({
        data: `module.exports = {__errorRetrievingVersions: true};`,
        path: file.getPathInPackage()
      });
    });
    return;
  }

  var lines = contents.split(/\r*\n\r*/);
  var versions = {};

  // based on https://github.com/meteor/meteor/blob/d9db4f52f2ea6d706a25156768ea42e1fbb8f599/tools/project-context.js#L1171
  lines.forEach(line => {
    line = line.replace(/^\s+|\s+$/g, '');

    if (line === '')
      return;

    var packageVersion = parsePackageAndVersion(line);
    if (!packageVersion)
      return;

    // If a package is in the file multiple times, Meteor only uses the first entry
    if (packageVersion.package in versions)
      return;

    versions[packageVersion.package] = packageVersion.version;
  });

  var result = `module.exports = ${JSON.stringify(versions)}`;

  files.forEach((file) => {
    file.addJavaScript({
      data: result,
      path: file.getPathInPackage()
    });
  });
}

Plugin.registerCompiler({
  filenames: ['.meteor-package-versions']
}, () => new PackageVersionCompiler);
