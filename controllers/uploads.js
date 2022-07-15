const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuarios, Producto } = require("../models");
const { inspect } = require('util');

const cargarArchivos = async (req = request, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.status(200).json({
            nombre
        });

    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
};

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id);
            if (!modelo) {
                return res.status(404).json({ msg: `no existe un usuario con el id ${id}.` });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({ msg: `no existe un producto con el id ${id}.` });
            }

            break;

        default:

            return res.status(500), json({ msg: 'Se me olvido validar esto' })
            break;
    }
    // limpiar imagenes previas 
    try {
        if (modelo.img) {
            //hay q borrar la imagen 
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            };
        };
    } catch (error) {
        res.status(500).json({ msg: 'no hay imagen o hubo error donde se borra.' })
    }


    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;
    await modelo.save();

    res.json({
        modelo

    });


};
const mostrarImg = async (req = request, res = response) => {

    const { id, coleccion } = req.params;
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `no existe un usuario con el id ${id}.` });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `no existe un producto con el id ${id}.` });
            }

            break;

        default:

            return res.status(500), json({ msg: 'Se me olvido validar esto' })
            break;
    }
    // limpiar imagenes previas 

    if (modelo.img) {
        //hay q borrar la imagen 
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        };
    };

    res.sendFile(pathImagen);

};

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id);
            if (!modelo) {
                return res.status(404).json({ msg: `no existe un usuario con el id ${id}.` });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(404).json({ msg: `no existe un producto con el id ${id}.` });
            }

            break;

        default:

            return res.status(500), json({ msg: 'Se me olvido validar esto' })
            break;
    }
    // limpiar imagenes previas 

    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');

        await cloudinary.uploader.destroy(public_id);

    };
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);


    modelo.img = secure_url;
    await modelo.save();

    res.json({
        secure_url

    });


};
module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImg,
    actualizarImagenCloudinary
}