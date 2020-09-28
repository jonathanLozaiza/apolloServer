const Usuario = require("../model/Usuario")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config({path:"variables.env"})

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
        }
    }
}

module.exports = resolvers;