const socket = require('socket.io')

const dotenv = require('dotenv')
dotenv.config()

const server = require('http').createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
  }

  // ...
})

const states = {}

const io = socket(server)

io.on('connection', client => {
  client.on('connectTraffic', slug => {
    client.join(`tl_${slug}`)

    client.emit('change_state', states[slug] || '')
  })

  client.on('alterState', data => {
    const { slug, state } = data
    data = JSON.stringify({ slug, run: state })

    mqttClient.publish('st/cross', Buffer.from(data, 'utf-8').toString('base64'))
  })
})

const mqtt = require('mqtt')
const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, {
  port: process.env.MQTT_PORT,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
})

mqttClient.on('message', (topic, message, packet) => {
  const base64 = Buffer.from(message).toString('ascii')
  const buff = Buffer.from(base64, 'base64').toString('ascii')
  const payload = JSON.parse(buff.toString('ascii'))

  switch (topic) {
    case 'st/traffic_light':
      states[payload.slug] = payload.state

      io.sockets.in(`tl_${payload.slug}`).emit(payload.action, payload.state)

      break
  }
})

mqttClient.subscribe('st/traffic_light')
mqttClient.subscribe('st/cross')

server.listen(process.env.PORT || 8000)
