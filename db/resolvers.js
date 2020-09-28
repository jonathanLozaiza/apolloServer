const Usuario = require("../model/Usuario")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config({path:"variables.env"})
const Producto = require("../model/Producto")

//CREAR TOKEN
const crearToken = (usuario,secreta,expiresIn) => {
    const {id,nombre,apellido,email} = usuario
    return jwt.sign({id},secreta,{expiresIn})
}

//Resolvers
const resolvers = {
    Query:{
        obtenerUsuario: async (_, {token}) => {
            const usuarioId = await jwt.verify(token,process.env.SECRETA);
            return usuarioId
        },
        obtenerProductos: async () => {
            try{
                const productos = await Producto.find({})
                return productos
            }catch(error){
                console.log(error)
            }
        },
        obtenerProducto: async (_, {id}) => {
            try{
                //verificar si existe el producto
                const producto = await Producto.findById(id)
                if(!producto){
                    throw new Error("El producto no existe")
                }

                return producto
            }catch(error){
                console.log(error)
            }
        }
    },
    Mutation:{
        nuevoUsuario: async (_, {input}) => {

            const {email, password} = input;

            //verificar si el usuario existe
            const usuarioExiste = await Usuario.findOne({email});
            if(usuarioExiste){
                throw new Error('El usuario ya esta registrado');
            }

            //hashear password
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt)

            //guardar usuario en la base de datos 
            try{
                const usuario = new Usuario(input);
                usuario.save();
                return usuario
            }catch(error){
                console.log(error)
            }

        },
        autenticarUsuario: async (_, {input}) => {
            
            const {email, password} = input
            
            //verificar si el usuario existe

            const usuarioExiste = await Usuario.findOne({email})
            if(!usuarioExiste){
                throw new Error("El usuario no existe")
            }

            //revizar si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, usuarioExiste.password)
            if(!passwordCorrecto){
                throw new Error("Password incorrecto")
            }

            //crear Token
            return {
                token: crearToken(usuarioExiste,process.env.SECRETA,"24h")
            }
        },
        nuevoProducto: async (_, {input}) => {
            
            try{
                const nuevoProducto = new Producto(input)

                //almacenar en la base de datos
                const producto = await nuevoProducto.save()

                return producto
                
            }catch(error){
                console.log(error)
            }
        },
        actualizarProducto: async (_, {id,input}) => {
            try{
                //verificar si existe el producto
                let producto = await Producto.findById(id)
                if(!producto){
                    throw new Error("El producto no existe")
                }

                producto = await Producto.findOneAndUpdate({_id:id},input,{new:true})

                return producto

            }catch(error){
                console.log(error)
            }
        },
        eliminarProducto: async (_, {id}) => {
            try{
                //verificar producto
                let producto = await Producto.findById(id);
                if(!producto){
                    throw new Error("El producto no existe")
                }

                await Producto.findOneAndDelete({_id:id})
                
                return "El producto se a eliminado correctamente"
            }catch(error){
                console.log(error)
            }
        }
    }
}

module.exports = resolvers;