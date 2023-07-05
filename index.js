const path = require('path');
const fs = require('fs');

const filePath = process.argv[2];

const isAbsolute = (route) => {
  return path.isAbsolute(route)
};

const relativeToAbsolute = (route) => {
  return path.resolve(route)
};

const exist = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      err ? reject(false) : resolve(true);
    });
  });
};

// const contentDirectory = (route) => {
//   return new Promise((resolve, reject) => {
//     fs.readdir(route, (err, files) => {
//       err ? reject(err) : resolve(files)
//     });
//   });
// };

// const filterContentDirectory = (route) => {
//   return new Promise((resolve, reject) => {
//     fs.readdir(route, (err, files) => {
//       if (err) {
//         reject(err);
//       } else {
//         const filteredFiles = files.filter((file) => path.extname(file) === '.md');
//         resolve(filteredFiles);
//       }
//     });
//   });
// }

const checkFileType = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        // si es un archivo
        if (stats.isFile()) {
          const fileExtension = path.extname(route);
          // filtrar si es md
          fileExtension === '.md' ? resolve(true) : reject(false);
          // si es un directorio
        } else if (stats.isDirectory()) {
          fs.readdir(route, (err, files) => {
            if (err) {
              reject(err);
            } else {
              // filtrar si es md
              const filteredFiles = files.filter((file) => path.extname(file) === '.md');
              // si no hay archivos .md, rechazar la promesa
              filteredFiles.length === 0 ? reject(false) : resolve(filteredFiles);
            }
          });
        }
      }
    })
  })
};



module.exports = {
  isAbsolute,
  filePath,
  relativeToAbsolute,
  exist,
  checkFileType,
}
