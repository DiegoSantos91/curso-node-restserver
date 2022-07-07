const { response, request } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuarios, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoId = isValidObjectId(termino);
    if (esMongoId) {
        const usuario = await Usuarios.findById(termino);
        return res.status(200).json({
            results: usuario ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuarios.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }],
    });

    res.status(200).json({
        results: usuarios ? [usuarios] : []
    });

};
const buscarCategorias = async (termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.status(200).json({
            results: categoria ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.status(200).json({
        results: categorias ? [categorias] : []
    });

};
const buscarProductos = async (termino = '', res = response) => {
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {
        const producto = await Producto.findById(termino)
            .populate('usuario', 'name')
            .populate('categoria', 'nombre');
        return res.status(200).json({
            results: producto ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('usuario', 'name')
        .populate('categoria', 'nombre');

    res.status(200).json({
        results: productos ? [productos] : []
    });

};

const buscar = async (req = request, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {

        return res.status(400).json({
            msg: `Las colecciones perimtidas son : ${coleccionesPermitidas}`

        });
    };
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':
            buscarProductos(termino, res);
            break;

        default:
            res.status(500).json({ msg: 'Invalid ' });
            break;
    }


};

module.exports = {
    buscar
}