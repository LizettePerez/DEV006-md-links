const { 
  isAbsolute,
  filePath,
  relativeToAbsolute,
} = require('./index');


const mdLinks = (path, option) => {
  return new Promise((resolve, reject) => {
    if (isAbsolute(path)) {
      resolve('La ruta es absoluta');
    } else {
      const absolutePath = relativeToAbsolute(path);
      reject(absolutePath);
    }
  })
}

mdLinks(filePath).then((result) => {
  console.log(result);
}).catch((err) => {
  console.log('Ruta convertida a absoluta: >>>', err);
});


// node mdlinks.js C:/Users/x_liz/Documents/GitHub/DEV006-md-links/index.js
// node mdlinks.js index.js
