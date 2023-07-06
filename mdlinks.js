const {
  isAbsolute,
  filePath,
  relativeToAbsolute,
  existPath,
  isFileMD,
  getFilesMD,
  hasLinks,
  fileValidation,
} = require('./index');


const mdLinks = (path, option) => {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject('No se proporcionó una ruta');
      return;
    }

    // ruta absoluta
    let absolutePath;
    absolutePath = isAbsolute(path) ? path : relativeToAbsolute(path);

    //ruta existente
    existPath(absolutePath)
      .then(() => {
        // Verificar si es archivo .md o directorio
        isFileMD(absolutePath)
          .then((fileExtension) => {
            if (fileExtension === '.md') {
              hasLinks(absolutePath)
                .then((result) => {
                  resolve(result)
                }).catch((err) => {
                  reject(err)
                });
            } else {
              // Es un directorio, obtener archivos .md
              getFilesMD(absolutePath, filePath)
                .then((mdFiles) => {
                  // Leer contenido md y verificar enlaces
                  const promises = mdFiles.map((file) => {
                    return hasLinks(file);
                  });
                  Promise.all(promises)
                    .then((result) => {
                      resolve(result);
                    }).catch((err) => {
                      reject(err);
                    });
                }).catch((err) => {
                  reject('El directorio no contiene archivos Markdown')
                });
            }
          }).catch((err) => {
            reject('El archivo no es Markdown')
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