const Rol = require('../models/rol');
const { Usuarios, Categoria, Producto } = require('../models');
const mongoose = require("mongoose");



const esRolValido = async (rol = '') => {
    const existeRol = await Rol.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB.`)
    };
};
const emailExiste = async (email = '') => {
    //verificar si el correo existe
    const existeEmail = await Usuarios.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ${email} ya esta registrado en la DB.`)
    }
}
const existeUsuarioPorId = async (id = '') => {
    const _id = id;
    const existeUsuario = await Usuarios.findById({ _id });
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe.`)
    }
}
const existeCategoria = async (id = '') => {
    const _id = id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error(`No es un id de Mongo válido`);
    }
    const existeCategoria = await Categoria.findById(_id);
    console.log("~ existeCategoria", existeCategoria)
    if (!existeCategoria) {
        throw new Error(`El id no existe ${id}`);
    }

}
const existeProducto = async (id = '') => {
    const _id = id;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        throw new Error(`No es un id de Mongo válido`);
    }
    const existeProducto = await Producto.findById(_id);
    if (!existeProducto) {
        throw new Error(`El Producto no existe ${id}`);
    }

}

const coleccionesPermitidas = async (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {

        throw new Error(`la coleccion ${coleccion} no esta incluida en ${colecciones}.`);

    }
    return true;
};

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
};