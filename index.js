const {ApolloServer} = require("apollo-server")
const typeDefs = require('./db/schemas')
const resolvers = require('./db/resolvers')
const conectarDB = require('./config/db')

//conectar a base de datos
conectarDB();

//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers
})


//Arrancar el servidor
server.listen().then(({url})=>{
    console.log(`el servidor esta corriendo en la url ${url}`)
})