const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const usuariosGet = async (req, res = response) => {
    const query = { status: true };
    const { l, d = 0 } = req.query;

    const [total, usuarios] = await Promise.all([
        usuario.countDocuments(query),
        usuario.find(query)
            .skip(d)
            .limit(l)
    ]);

    res.json({
        total,
        usuarios
    })
};

const usuariosPost = async (req, res = response) => {

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
    const { uid, password, google, email, ...resto } = req.body;
    const { id } = req.params;

    //validar contra DB
    if (password) {
        //encriptar pass
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto)
    res.json({
        usuario
    })
};
const usuariosPatch = (req, res = response) => {
    res.json({
        "msg": 'Patch API- Controllador'
    })
};
const usuariosDelete = async (req, res = response) => {
    const { _id } = req.params;
    // const uid = req.uid;
    // delete fisico 
    // const usuario = await Usuario.findByIdAndDelete(_id);
    //delete no fisico 
    const usuario = await Usuario.findByIdAndUpdate(_id, { status: false });
    
    //obtener el usuario autenticado
    const usuarioAutenticado = req.usuario

    res.json({
        usuario,
        usuarioAutenticado
        // ,
        // uid
    })
};





module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};