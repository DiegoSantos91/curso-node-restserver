const { Router } = require('express');
const { body, param } = require('express-validator');
const {obtenerProductos,obtenerProducto,crearProducto,actualizarProducto,borrarProducto } = require('../controllers/productos');
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT,  esAdminRol } = require('../middlewares');
const router = Router();

//obtener todas las productos -- publico
router.get('/', obtenerProductos);

//obtener una producto por id -- publico
router.get('/:id', [
    param('id', 'No existe').exists({ checkNull: true }).isMongoId().bail()
        .custom(existeProducto).bail(),
    validarCampos
], obtenerProducto);

//crear una producto  -- cualquier persona con un token valido
router.post('/', [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('categoria', 'No existe categoria').exists({ checkNull: true }).isMongoId().bail()
        .custom(existeCategoria).bail(),
    validarCampos,
    validarJWT
], crearProducto);

//actualizar  -- cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    param('id','No existe un id').custom(existeProducto).bail( ),
    validarCampos
], actualizarProducto);

//borrar   -- admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    param('id', 'No es un id valido').exists({ checkNull: true })
    .isMongoId().bail()
    .custom(existeProducto).bail(),
    validarCampos
],borrarProducto);
module.exports = router;