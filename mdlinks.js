const { 
  isAbsolute,
  filePath,
  relativeToAbsolute,
  exist,
  checkFileType,
} = require('./index');


const mdLinks = (path, option) => {
  return new Promise((resolve, reject) => {
    // ruta absoluta
    let absolutePath;
    absolutePath = isAbsolute(path) ? path : relativeToAbsolute(path);

    //ruta existente
    exist(absolutePath)
      .then(() => {
        // Verificar archivo md
        checkFileType(absolutePath)
          .then(() => {
            resolve('El archivo SI es de tipo .md');
          }).catch(() => {
            reject('El archivo No es Markdown')
          });
      })
      .catch(() => {
        reject('La ruta no es válida');
      });

  });
};


mdLinks(filePath)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
});


// node mdlinks.js C:/Users/x_liz/Documents/GitHub/DEV006-md-links/index.js
// node mdlinks.js index.js
// node mdlinks.js index.js12
// node mdlinks.js README.md

// CONTIENE MD
// node mdlinks.js C:/Users/x_liz/Documents/GitHub/DEV006-data-lovers

// NO CONTIENE MD
// node mdlinks.js C:/Users/x_liz/Documents/GitHub/Challenge-Oracle-One