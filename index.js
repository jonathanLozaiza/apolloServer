const {ApolloServer} = require("apollo-server")
const typeDefs = require('./db/schemas')
const resolvers = require('./db/resolvers')

//Servidor
const server = new ApolloServer({
    typeDefs,
    resolvers
})


//Arrancar el servidor
server.listen().then(({url})=>{
    console.log(`el servidor esta corriendo en la url ${url}`)
})