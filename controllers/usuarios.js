const { response } = require('express')



const usuariosGet = (req, res = response) => {

// const params = req.query;
const {q,nombre,apikey} = req.query;

    res.json({
        "msg": 'get API- Controllador',
        q,
        nombre,
        apikey
    })
};

const usuariosPost = (req, res = response) => {
    // const body = req.body;
    const {nombre, edad} = req.body;

    res.json({
        msg: 'Post API- Controllador',
        // body
        nombre,
        edad
    })
};
const usuariosPut = (req, res = response) => {
    const id = req.params.id;
    res.json({
        "msg": 'Put API- Controllador',
        id:id
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