const mdLinks = require('../src/mdlinks');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const {
  isAbsolute,
  relativeToAbsolute,
  existPath,
  isFileMD,
  getFilesMD,
  thereAreLinks,
  validateLink,
} = require('../src/index');


describe('Rechazar mdLinks.js', () => {
  it('Rechazar si no se proporciona una ruta', () => {
    return mdLinks('').catch((err) => {
      expect(err).toBe('No se proporcionó una ruta');
    });
  });

  it('Rechazar si la ruta no existe', () => {
    return mdLinks('index.js222').catch((err) => {
      expect(err).toBe('La ruta no es válida');
    });
  });

  it('Rechazar si el archivo no es markdown', () => {
    return mdLinks('Prueba test01/test01.js').catch((err) => {
      expect(err).toBe('El archivo no es Markdown');
    })
  });

  it('Rechazar si el directorio no contiene markdown', () => {
    return mdLinks('Prueba test01').catch((err) => {
      expect(err).toBe('El directorio no contiene archivos Markdown');
    });
  });

  it('Rechazar si el archivo no contiene enlaces', () => {
    const filePath = 'C:/Users/x_liz/Documents/GitHub/DEV006-md-links/Prueba test02.md';
    return mdLinks(filePath, { validate: true })
      .catch((err) => {
        expect(err).toBe(`El archivo ${filePath} no contiene enlaces`);
    });
  });
});


describe('Archivos mdLinks.js', () => {
  it('Devuelve los enlaces de un archivo markdown', () => {
    const filePath = 'test01.md';
    return mdLinks(filePath)
    .then((links) => {
      expect(links).toEqual([
        {
          href: 'https://www.example.com/404',
          text: 'banner',
          file: 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test01.md'
        }
      ]);
    })
  });

  it('Devuelve los enlaces validados de un archivo markdown', () => {
    const filePath = 'test01.md';
    return mdLinks(filePath, { validate: true })
      .then((links) => {
        expect(links).toStrictEqual([
          {
            href: 'https://www.example.com/404',
            text: 'banner',
            file: 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test01.md',
            status: 404,
            ok: 'fail'
          }
        ]);
      });
  });
});


describe('Directorio mdLinks.js', () => {
  it('Devuelve los enlaces en un markdown de un directorio', () => {
    const filePath = 'Prueba test02';
    return mdLinks(filePath)
    .then((links) => {
      expect(links).toEqual([
        {
          href: 'https://www.example.com/404',
          text: 'banner',
          file: 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test01.md'
        },
        {
          href: 'https://camo.githubusercontent.com/cb3d8a54bb69b30003dd51290d740c041e812df4d5dd2c45c3d1bd7a8e74e391/68747470733a2f2f696b2e696d6167656b69742e696f2f6a6f796365517565727562696e6f2f706572736f6e6167656d5f4d4c62567679624d62372e676966',
          text: 'banner2',
          file: 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test03.md'
        }
      ]);
    })
  });

  it('Devuelve los enlaces validados en un markdown de un directorio', () => {
    const filePath = 'Prueba test02';
    return mdLinks(filePath, { validate: true })
    .then((links) => {
      expect(links).toStrictEqual([
        {
          href: 'https://www.example.com/404',
          text: 'banner',
          file: 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test01.md',
          status: 404,
          ok: 'fail'
        },
        {
          href: 'https://camo.githubusercontent.com/cb3d8a54bb69b30003dd51290d740c041e812df4d5dd2c45c3d1bd7a8e74e391/68747470733a2f2f696b2e696d6167656b69742e696f2f6a6f796365517565727562696e6f2f706572736f6e6167656d5f4d4c62567679624d62372e676966',
          text: 'banner2',
          file: 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test03.md',
          status: 200,
          ok: 'OK'
        }
      ]);
    })
  });
});


describe('isAbsolute index.js', () => {
  it('Debe retornar true si es una ruta absoluta', () => {
    const path = 'C:/Users/x_liz/Documents/GitHub/DEV006-md-links/Prueba test01';
    const result = isAbsolute(path);
    expect(result).toBe(true);
  });

  it('Debe retornar false si es una ruta relativa', () => {
    const path = 'Prueba test01';
    const result = isAbsolute(path);
    expect(result).toBe(false);
  });
});


describe('relativeToAbsolute index.js', () => {
  it('Debe convertir una ruta relativa a ruta absoluta', () => {
    const path = 'Prueba test01';
    const result = relativeToAbsolute(path);
    expect(result).toBe('C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test01');
  });
});


describe('existPath index.js', () => {
  it('Debe resolver true si la ruta existe', () => {
    const path = 'Prueba test01';
    return expect(existPath(path)).resolves.toBe(true);
  });

  it('Debe resolver false si la ruta no existe', () => {
    const path = 'Prueba test011212';
    return expect(existPath(path)).rejects.toBe(false);
  });
});


describe('isFileMD index.js', () => {
  it('Debe resolver con la extensión del archivo si es un archivo Markdown', () => {
    const path = 'test01.md';
    return expect(isFileMD(path)).resolves.toBe('.md');
  });

  it('Debe resolver con false si es un directorio', () => {
    const path = 'Prueba test01';
    return expect(isFileMD(path)).resolves.toBe(false);
  });

  it('Debe rechazar con un mensaje de error si no es un archivo Markdown', () => {
    const path = 'package.json';
    return expect(isFileMD(path)).rejects.toBe('El archivo no es Markdown');
  });

  it('Debe rechazar si la ruta no existe', () => {
    const route = 'Prueba test011212';
    return expect(isFileMD(route)).rejects.toThrow();
  });
});


describe('getFilesMD index.js', () => {
  it('Debe resolver con la lista de archivos Markdown dentro del directorio', () => {
    const route = 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02';
    const filePath = 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02';

    // Mock de fs.readdir para devolver archivos específicos
    jest.spyOn(fs, 'readdir').mockImplementation((route, callback) => {
      const files = ['test01.md', 'test02.md', 'test03.md'];
      callback(null, files);
    });

    const expected = [
      'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test01.md',
      'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test02.md',
      'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test03.md'
    ];

    return expect(getFilesMD(route, filePath)).resolves.toEqual(expected);
  });

  it('Debe rechazar si no hay archivos Markdown dentro del directorio', () => {
    const route = 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02';
    const filePath = 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02';

    // Mock de fs.readdir para devolver archivos específicos
    jest.spyOn(fs, 'readdir').mockImplementation((route, callback) => {
      const files = ['test01.js'];
      callback(null, files);
    });

    return expect(getFilesMD(route, filePath)).rejects.toBe(false);
  });

  it('Debe rechazar con el error proporcionado si ocurre un error al leer el directorio', () => {
    const route = 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02';

    // Mock de fs.readdir para devolver archivos específicos
    jest.spyOn(fs, 'readdir').mockImplementation((route, callback) => {
      const err = 'El directorio no contiene archivos Markdown';
      callback(err);
    });

    return expect(getFilesMD(route)).rejects.toBe('El directorio no contiene archivos Markdown');
  });
});


describe('thereAreLinks index.js', () => {
  it('Debe resolver con los enlaces encontrados en un archivo', () => {
    const route = 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test01.md'

    // Mock de fs.readFile para devolver un contenido específico
    jest.spyOn(fs, 'readFile').mockImplementation((route, options, callback) => {
      const data = 'prueba1 ![banner](https://www.example.com/404)';
      callback(null, data);
    });

    const expected = [
      {
        href: 'https://www.example.com/404',
        text: 'banner',
        file: 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test01.md',
      }
    ]

    return expect(thereAreLinks(route)).resolves.toEqual(expected);
  });

  it('Debe rechazar si el archivo no contiene enlaces', () => {
    const route = 'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\Prueba test02\\test02.md'

    // Mock de fs.readFile para devolver un contenido específico
    jest.spyOn(fs, 'readFile').mockImplementation((route, options, callback) => {
      const data = 'Texto de prueba';
      callback(null, data);
    });

    return expect(thereAreLinks(route)).rejects.toBe(`El archivo ${route} no contiene enlaces`);
  });
});

describe('validateLink index.js', () => {
  it('Debe resolver con el resultado correcto si la petición es exitosa', () => {
    const link = {
      href:'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test02.md',
      text:'banner',
      file:'https://camo.githubusercontent.com/cb3d8a54bb69b30003dd51290d740c041e812df4d5dd2c45c3d1bd7a8e74e391/68747470733a2f2f696b2e696d6167656b69742e696f2f6a6f796365517565727562696e6f2f706572736f6e6167656d5f4d4c62567679624d62372e676966'
    }

    // Mock de axios.get
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 200, statusText: 'OK' });

    const expected = {
      href:'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test02.md',
      text:'banner',
      file:'https://camo.githubusercontent.com/cb3d8a54bb69b30003dd51290d740c041e812df4d5dd2c45c3d1bd7a8e74e391/68747470733a2f2f696b2e696d6167656b69742e696f2f6a6f796365517565727562696e6f2f706572736f6e6167656d5f4d4c62567679624d62372e676966',
      status: 200,
      ok: 'OK'
    }

    return expect(validateLink(link)).resolves.toEqual(expected);
  });

  it('Debe resolver con el resultado correcto si la petición falla', () => {
    const link = {
      href:'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test01.md',
      text:'banner',
      file:'https://www.example.com/404'
    }

    // Mock de axios.get
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ status: 404, statusText: 'fail' });

    const expected = {
      href:'C:\\Users\\x_liz\\Documents\\GitHub\\DEV006-md-links\\test01.md',
      text:'banner',
      file:'https://www.example.com/404',
      status: 404,
      ok: 'fail'
    }

    return expect(validateLink(link)).resolves.toEqual(expected);
  });
});