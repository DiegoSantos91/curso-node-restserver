const { Router } = require('express');
const { body, param, check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria,borrarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT,  esAdminRol } = require('../middlewares');
const router = Router();

//obtener todas las categorias -- publico
router.get('/', obtenerCategorias);

//obtener una categoria por id -- publico
router.get('/:id', [
    param('id', 'No existe').exists({ checkNull: true }).isMongoId().bail()
        .custom(existeCategoria).bail(),
    validarCampos
], obtenerCategoria);

//crear una categoria  -- cualquier persona con un token valido
router.post('/', [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
], crearCategoria);

//actualizar  -- cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    param('id','No existe un id').custom(existeCategoria).bail( ),
    validarCampos
], actualizarCategoria);

//borrar   -- admin
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    param('id', 'No es un id valido').exists({ checkNull: true })
    .isMongoId().bail()
    .custom(existeCategoria).bail(),
    validarCampos
],borrarCategoria);
module.exports = router;