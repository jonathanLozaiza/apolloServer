const {ApolloServer, gql} = require("apollo-server")

//Servidor
const server = new ApolloServer()

//Schema

const typeDefs = gql`

    type Curso {
        nombre:String
        tecnologia:String
    }

    type Query {
        obtenerCursos:Curso
    }
`

//Resolvers

const resolvers = {
    Query:{
        obtenerCursos
    }
}


//Arrancar el servidor
server.listen().then(({url})=>{
    console.log(`el servidor esta corriendo en la url ${url}`)
})