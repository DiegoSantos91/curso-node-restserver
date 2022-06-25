
const { Router } = require('express');
const { body, param } = require('express-validator');
const { usuariosGet, usuariosPost,
    usuariosPut, usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const {validarCampos,validarJWT,esAdminRol,tieneRol} = require('../middlewares')

const router = Router();

router.get('/', [

], usuariosGet);

router.put('/:id', [
    param('id', 'No es un id valido').exists({ checkNull: true })
        .isMongoId().bail()
        .custom(existeUsuarioPorId).bail(),
    body('rol').custom(esRolValido),
    validarCampos
], usuariosPut);

router.post('/', [
    body('name', 'El name es obligatorio').not().isEmpty(),
    body('password', 'El password debe tener al menos 6 caracteres.').isLength({ min: 6 }),
    body('email').custom(emailExiste),
    body('rol').custom(esRolValido),
    validarCampos
], usuariosPost);

router.delete('/:_id', [
    validarJWT,
    // esAdminRol,
    tieneRol('ADMIN_ROL','VENTAS_ROL'),
    param('_id', 'No es un id valido').exists({ checkNull: true })
    .isMongoId().bail()
    .custom(existeUsuarioPorId).bail(),
    validarCampos

], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;