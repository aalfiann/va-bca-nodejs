const config = require('./config.js')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const server = require('fastify')({
  logger: config.logger
})

function App () {
    server.register(require('./routes/default.js'))
  
    // Custom Error Handler
    server.setErrorHandler(function (error, request, reply) {
      server.log.error(error)
      reply.send({ code: 500, message: 'Whoops, Something went wrong!' })
    })
  
    const start = async () => {
      try {
        await server.listen(config.port)
      } catch (err) {
        server.log.error(err)
        process.exit(1)
      }
    }
    start()
  }
  
  if (config.useWorker) {
    if (cluster.isMaster) {
      console.log(`Master ${process.pid} is running`)
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
      }
      cluster.on('exit', worker => {
        console.log(`Worker ${worker.process.pid} died`)
      })
    } else {
      App()
    }
  } else {
    App()
  }