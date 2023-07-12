const mdLinks = require('../src/mdlinks');


describe('Rechazar mdLinks', () => {

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


describe('Archivos mdLinks', () => {

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


describe('Directorio mdLinks', () => {

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