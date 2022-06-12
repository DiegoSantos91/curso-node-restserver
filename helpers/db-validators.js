const Rol = require('../models/rol');
const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Rol.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB.`)
    };
};
const emailExiste = async (email = '') => {
    //verificar si el correo existe
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ${email} ya esta registrado en la DB.`)
    }
}
const existeUsuarioPorId = async (id='' ) => {
    //verificar si el correo existe
    const _id = id;
    const existeUsuario = await Usuario.findById({ _id });
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe.`)
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
};