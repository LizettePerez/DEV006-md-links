const path = require('path');
const fs = require('fs');
const axios = require('axios');


const filePath = process.argv[2];

const isAbsolute = (route) => {
  return path.isAbsolute(route)
};

const relativeToAbsolute = (route) => {
  return path.resolve(route)
};

const existPath = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      err ? reject(false) : resolve(true);
    });
  });
};

const isFileMD = (route) => {
  return new Promise((resolve, reject) => {
    fs.stat(route, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.isFile()) {
        const fileExtension = path.extname(route);
        fileExtension === '.md' ? resolve(fileExtension) : reject('El archivo no es Markdown');
      } else if (stats.isDirectory()) {
        resolve(false);
      }
    });
  });
};

const getFilesMD = (route, filePath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(route, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const filteredFiles = files.filter((file) => path.extname(file) === '.md');
        filteredFiles.length === 0 ? reject(false) : resolve(filteredFiles.map(file => path.join(filePath, file)));
      }
    });
  });
};


const thereAreLinks = (route) => {
  return new Promise((resolve, reject) => {
    fs.readFile(route, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const linkRegex = /\[(.*)\]\((https?:\/\/[\w\d./?=#]+)\)/g;

        const matches = [...data.matchAll(linkRegex)];
        const links = matches.map((match) => {
          const [text, href] = match.slice(1);
          return { href, text, file: route }; 
        });

        if (links.length > 0) {
          resolve(links);
        } else {
          reject(`El archivo ${route} no contiene enlaces`);
        }
      }
    });
  });
};


const validateLink = (link) => {
  return new Promise((resolve, reject) => {
    axios.get(link.href) 
      .then((response) => {
        const result = {
          href: link.href,
          text: link.text,
          file: link.file,
          status: response.status,
          ok: response.statusText
        };
        resolve(result);
      })
      .catch((error) => {
        const result = {
          href: link.href,
          text: link.text,
          file: link.file,
          status: error.response.status,
          ok: 'fail'
        };
        resolve(result);
      });
  });
};


module.exports = {
  isAbsolute,
  filePath,
  relativeToAbsolute,
  existPath,
  isFileMD,
  getFilesMD,
  thereAreLinks,
  validateLink,
}



