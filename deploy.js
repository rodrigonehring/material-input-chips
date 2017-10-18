const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const semver = require('semver');


const getCurrentTag = () => new Promise((resolve, reject) => {
  exec('git describe --abbrev=0 --tags', (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve(stdout.replace('\n', ''));
  });
});

const getCurrentBranch = () => new Promise((resolve, reject) => {
  exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve(stdout.replace('\n', ''));
  });
});


const openPackage = () => new Promise((resolve, reject) => {
  fs.readFile('./package.json', 'utf8', (err, data) => {
    if (err) {
      return reject(err);
    }

    resolve(JSON.parse(data));
  });
});

const commit = (version) => new Promise((resolve, reject) => {
  exec(`git tag ${version} && git push --tags`, (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve();
  });
});


async function deploy() {
  const currentTag = await getCurrentTag();
  const currentBranch = await getCurrentBranch();
  const { version: packageVersion } = await openPackage();

  console.log('current branch: ', currentBranch);
  console.log('current tag version: ', currentTag);
  console.log('current package.json version: ', packageVersion);


  if (semver.gt(packageVersion, currentTag)) {
    console.log('Package.json have a biggest version than git');

    try {
      await commit(packageVersion);
      console.log('Success!');
    } catch (e) {
      console.log('Error!', e);
      // process.exit(1);
    }    
  }
}

deploy();

