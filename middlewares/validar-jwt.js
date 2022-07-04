const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición.'
        })
    }
    console.log(token)
    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        //leer usuario correspondiente al uid

        const usuario = await Usuario.findOne(req.uid);
        if(!usuario){
            return ret.status(401).json({
                msg: 'Token no válido - usuario no existe'
            })
        }
        if (!usuario.status) {
            return ret.status(401).json({
                msg: 'Token no válido - usuario con estado : false'
            })
        }
        req.usuario = usuario
        req.uid = uid
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no válido.'
        })
    }
};

module.exports = {
    validarJWT
}