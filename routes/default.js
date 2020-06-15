
async function defaultRoute (server, options) {
  server.get('/test', async (request, reply) => {
    return reply.send({ code: 200, message: 'test' })
  })
}

module.exports = defaultRoute
