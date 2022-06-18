const { Router } = require('express');
const { body, param } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
body('email','El correo es obligatorio').isEmail(),
body('pass','El pass es obligatorio').not().isEmpty(),
validarCampos
], login);




module.exports = router;