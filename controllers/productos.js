const { response, request } = require("express");
const { Producto,Categoria } = require("../models");




const borrarProducto = async (req, res = response) => {
    const { id } = req.params;
    //delete no fisico 
    const producto = await Producto.findByIdAndUpdate(id, { estado: false });
    //obtener el usuario autenticado
    const usuarioAutenticado = req.usuario

    res.status(200).json({
        producto,
        usuarioAutenticado
    })
};
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        producto
    })
};
const obtenerProductos = async (req, res = response) => {
    const query = { status: true };
    const { l, d = 0 } = req.query;

    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'name')
            .populate('categoria', 'nombre')
            .skip(d)
            .limit(l)
    ]);

    res.status(200).json({
        total,
        producto
    })
};
const obtenerProducto = async (req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
    .populate('usuario', 'name')
    .populate('categoria','nombre');
    res.status(200).json({
        producto
    })
};
const crearProducto = async (req = request, res = response) => {
    try {

        const nombre = req.body.nombre.toUpperCase();
        const {precio,descripcion,categoria } = req.body;
        const productoDB = await Producto.findOne({ nombre });
        const categoriaDB = await Categoria.findOne({ categoria });
        if (productoDB) {
            return res.status(400).json({
                msg: `El producto ${productoDB.nombre}, ya existe`
            });
        }
        if (!categoriaDB) {
            return res.status(404).json({
                msg: `la categoria no existe o no se encuentra, verifique.`
            });
        }
        //generar data a guardar 
        const data = {
            nombre,
            usuario: req.usuario._id,
            categoria,
            precio,
            descripcion
        }
        const producto = new Producto(data);
        //guardar en DB
        await producto.save();

        res.status(201).json(producto);

    } catch (error) {

        return res.status(500).json({
            msg: 'Hable con el admin ocurrio un error creando la producto.'
        })
    }

};




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}