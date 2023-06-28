const path = require('path');
//const fs = require('fs');

const filePath = process.argv[2];

const isAbsolute = (route) => {
  return path.isAbsolute(route)
}

const relativeToAbsolute = (route) => {
  return path.resolve(route)
}

module.exports = {
  isAbsolute,
  filePath,
  relativeToAbsolute,
}
