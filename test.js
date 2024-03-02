const { fileURLToPath } = require('url');
const { dirname, join } = require('path');
const fs = require('fs');

const viewsPath = __dirname + '/views';
const publicPath = __dirname + '/public';


try {
    fs.statSync(viewsPath);
    console.log('El directorio de vistas existe');
} catch (error) {
    console.log('El directorio de vistas no existe');
}

try {
    fs.statSync(publicPath);
    console.log('El directorio público existe');
} catch (error) {
    console.log('El directorio público no existe');
}
