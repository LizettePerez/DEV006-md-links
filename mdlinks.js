const { resolve } = require('path');
const { 
  isAbsolute,
  filePath,
  relativeToAbsolute,
  exist,
} = require('./index');


const mdLinks = (path, option) => {
  return new Promise((resolve, reject) => {
    let absolutePath;
    if (isAbsolute(path)) {
      absolutePath = path;
    } else {
      absolutePath = relativeToAbsolute(path);
    }
    exist(absolutePath)
      .then(() => {
        resolve('ruta existe');
      })
      .catch(() => {
        reject('ruta NO existe');
      });

      // if (exist(absolutePath)) {
      //   resolve('La ruta existe');
      // } else {
      //   reject(new Error('La ruta no existe'));
      // }
  });
};


mdLinks(filePath).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});


// node mdlinks.js C:/Users/x_liz/Documents/GitHub/DEV006-md-links/index.js
// node mdlinks.js index.js
