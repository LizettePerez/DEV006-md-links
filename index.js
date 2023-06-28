const path = require('path');
const fs = require('fs');

const filePath = process.argv[2];

const isAbsolute = (route) => {
  return path.isAbsolute(route)
}

const relativeToAbsolute = (route) => {
  return path.resolve(route)
}

const exist = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports = {
  isAbsolute,
  filePath,
  relativeToAbsolute,
  exist,
}
