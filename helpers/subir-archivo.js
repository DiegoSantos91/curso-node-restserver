const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = async (files, extensionesValidas = ['png','PNG', 'jpg', 'jpeg'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const { archivo } = files;

        //validar extensiones 
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionesValidas.includes(extension)) {
            reject(`La extension ${extension} no esta permitida, ${extensionesValidas} son las permitidas`);
        };

        const nombreTemporal = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemporal);
        });
    });
};







module.exports = { subirArchivo }
