const { Router } = require('express');
const { body, param } = require('express-validator');
const { cargarArchivos, actualizarImagen, mostrarImg, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos,validarArchivoSubir} = require('../middlewares');

const router = Router();


router.post('/',[
    validarArchivoSubir
],cargarArchivos);

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    param('id','El id no es valido').isMongoId(),
    param('coleccion').custom( c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],actualizarImagenCloudinary);

router.get('/:coleccion/:id',[
    param('id','El id no es valido').isMongoId(),
    param('coleccion').custom( c => coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImg);

module.exports = router; 