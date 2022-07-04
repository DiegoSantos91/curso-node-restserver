const { Router } = require('express');
const { body, param } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    body('email', 'El correo es obligatorio').isEmail(),
    body('pass', 'El pass es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    body('id_token', 'El token de google es obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);




module.exports = router;