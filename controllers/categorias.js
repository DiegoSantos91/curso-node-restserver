const { response, request } = require("express");
const { Categoria, Usuarios } = require("../models");




const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    //delete no fisico 
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });
    //obtener el usuario autenticado
    const usuarioAutenticado = req.usuario

    res.status(200).json({
        categoria,
        usuarioAutenticado
    })
};
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        categoria
    })
};
const obtenerCategorias = async (req, res = response) => {
    const query = { status: true };
    const { l, d = 0 } = req.query;

    const [total, categoria] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'name')
            .skip(d)
            .limit(l)
    ]);

    res.status(200).json({
        total,
        categoria
    })
};
const obtenerCategoria = async (req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'name');
    res.status(200).json({
        categoria
    })
};
const crearCategoria = async (req = request, res = response) => {
    try {

        const nombre = req.body.nombre.toUpperCase();
        const categoriaDB = await Categoria.findOne({ nombre });
        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre}, ya existe`
            });
        }
        //generar data a guardar 
        const data = {
            nombre,
            usuario: req.usuario._id
        }
        const categoria = new Categoria(data);
        //guardar en DB
        await categoria.save();

        res.status(201).json(categoria);

    } catch (error) {

        return res.status(500).json({
            msg: 'Hable con el admin ocurrio un error creando la categoria.'
        })
    }

};




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}