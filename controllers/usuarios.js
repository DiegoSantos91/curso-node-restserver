const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = (req, res = response) => {

    // const params = req.query;
    const { q, nombre, apikey } = req.query;

    res.json({
        "msg": 'get API- Controllador',
        q,
        nombre,
        apikey
    })
};

const usuariosPost = async (req, res = response) => {

    // const body = req.body;
    const { name, email, password, rol } = req.body;
    const usuario = new Usuario({ name, email, password, rol });

    //encriptar pass
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //guardar en db
    await usuario.save();

    res.json({
        usuario
    })
};
const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id,password, google,email, ...resto } = req.body;

    //validar contra DB
    if (password) {
        //encriptar pass
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto)
    res.json({
        "msg": 'Put API- Controllador',
        usuario
    })
};
const usuariosPatch = (req, res = response) => {
    res.json({
        "msg": 'Patch API- Controllador'
    })
};
const usuariosDelete = (req, res = response) => {
    res.json({
        "msg": 'Delete API- Controllador'
    })
};





module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};