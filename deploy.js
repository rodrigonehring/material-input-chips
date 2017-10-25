const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


<<<<<<< HEAD
=======

>>>>>>> a2db476... deploy
const getCurrentTag = () => new Promise((resolve, reject) => {
  exec('git describe --abbrev=0 --tags', (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve(stdout.replace('\n', ''));
  });
});

<<<<<<< HEAD
const getCurrentBranch = () => new Promise((resolve, reject) => {
  exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
    if (err) {
      return reject(err);
    }

    resolve(stdout.replace('\n', ''));
  });
});


=======
>>>>>>> a2db476... deploy
const openPackage = () => new Promise((resolve, reject) => {
  fs.readFile('./package.json', 'utf8', (err, data) => {
    if (err) {
      return reject(err);
    }

    resolve(JSON.parse(data));
  });
});

const savePackage = (content) => new Promise((resolve, reject) => {
  fs.writeFile('./package.json', JSON.stringify(content, null, 2), (err) => {
    if (err) {
      return reject(err);
    }

    resolve();
  });
});


<<<<<<< HEAD
const commit = (branch, version) => new Promise((resolve, reject) => {
  exec(`git add . && git commit -m "Auto updating version" && git tag ${version} -f && git push origin ${branch} && git push --tags -f`, (err, stdout) => {
=======
const commit = (version) => new Promise((resolve, reject) => {
  exec(`git add . && git commit -m "Auto updating version" && git tag ${version} -f && git push && git push --tags`, (err, stdout) => {
>>>>>>> a2db476... deploy
    if (err) {
      return reject(err);
    }

    resolve();
  });
});


async function deploy() {
  const currentTag = await getCurrentTag();
<<<<<<< HEAD
  const currentBranch = await getCurrentBranch();
  const packageJson = await openPackage();

  console.log('current branch: ', currentBranch);
  console.log('current tag version: ', currentTag);
  console.log('current package.json version: ', packageJson.version);
=======
  const packageJson = await openPackage();

  console.log('currrent tag version: ', currentTag);
  console.log('currrent package.json version: ', packageJson.version);
>>>>>>> a2db476... deploy

  if (currentTag !== packageJson.version) {
    console.log('Different versions, updating package.json');
    packageJson.version = currentTag;
    await savePackage(packageJson);
<<<<<<< HEAD
    await commit(currentBranch, currentTag);
=======
    await commit(currentTag);
>>>>>>> a2db476... deploy

    console.log('Success!');
  }
}

deploy();

