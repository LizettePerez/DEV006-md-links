const {
  isAbsolute,
  filePath,
  relativeToAbsolute,
  existPath,
  isFileMD,
  getFilesMD,
  thereAreLinks,
  fileValidation,
  validateLink,
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
              thereAreLinks(absolutePath)
                .then((links) => {
                  if (
                    option === 'validate' ||
                    option === 'v' ||
                    option === 'Validate' ||
                    option === 'VALIDATE'
                  ) {
                    const linkPromises = links.map((link) => {
                      return validateLink(link);
                    });
                    Promise.all(linkPromises)
                      .then((result) => {
                        resolve(result);
                      }).catch((err) => {
                        reject(err);
                      });
                  } else {
                    resolve(links);
                  }
                }).catch((err) => {
                  reject(err)
                });
            } else {
              // Es un directorio, obtener archivos .md
              getFilesMD(absolutePath, filePath)
                .then((mdFiles) => {
                  // Leer contenido md y verificar enlaces
                  const promises = mdFiles.map((file) => {
                    return thereAreLinks(file).then((links) => {
                      if (
                        option === 'validate' ||
                        option === 'v' ||
                        option === 'Validate' ||
                        option === 'VALIDATE'
                      ) { const linkPromises = links.map((link) => {
                        return validateLink(link);
                      });
                      return Promise.all(linkPromises);
                    } else {
                      resolve(links);
                    }
                    });
                  });
                  Promise.all(promises)
                    .then((result) => {
                      resolve(result);
                    }).catch((err) => {
                      reject(err);
                    });
                }).catch(() => {
                  reject('El directorio no contiene archivos Markdown')
                });
            }
          }).catch(() => {
            reject('El archivo no es Markdown')
          });
      })
      .catch(() => {
        reject('La ruta no es válida');
      });
  });
};


mdLinks(filePath, fileValidation)
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
// node mdlinks.js C:/Users/x_liz/Documents/GitHub/DEV006-md-links/

// NO CONTIENE MD
// node mdlinks.js C:/Users/x_liz/Documents/GitHub/Challenge-Oracle-One