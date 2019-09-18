const socket = require('socket.io')

const socketServer = (app) => {
  const io = socket(app.http)

  io.on('connection', client => {
    client.on('connectTraffic', slug => {
      client.join(`tl_${slug}`)

      client.emit('change_state', app.states[slug] || '')
    })

    client.on('alterState', data => {
      app.mqtt.publish('st/cross', { run: 'alter_state', ...data })
    })
  })

  this.io = io

  this.emit = (topic, payload) => {
    this.io.in(topic).emit({ ...payload })
  }

  return this
}
module.exports = socketServer
