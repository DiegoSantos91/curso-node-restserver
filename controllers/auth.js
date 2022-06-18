const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

    const { email, pass } = req.body;
    try {
        // esto se fija si hay un email valido sino sale el error 400
        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / pass no son correctos - email '
            });
        }
        // ver si esta activo 
        if (!usuario.status) {
            return res.status(400).json({
                msg: 'Usuario / pass no son correctos - estado : FALSE '
            });
        }
        // ver si el pass es correcto 

        const validPass = bcryptjs.compareSync(pass, usuario.password);
        if (!validPass) {
            return res.status(400).json({
                msg: 'Usuario / pass no son correctos - pass '
            });
        }
        //generar jwt 
        const token = await generarJWT(usuario.id);

        res.json({
           usuario,
           token
        })
    } catch (error) {

        return res.status(500).json({
            msg: 'Hable con el admin.'
        })
    }



}


module.exports = {
    login
};