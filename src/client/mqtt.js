const mqtt = require('mqtt')

const mqttClient = (app) => {
  this.client = mqtt.connect(`mqtt://${process.env.MQTT_HOST}`, {
    port: process.env.MQTT_PORT,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS
  })

  this.client.on('message', (topic, message, packet) => {
    const base64 = Buffer.from(message).toString('ascii')
    const buff = Buffer.from(base64, 'base64').toString('ascii')
    const payload = JSON.parse(buff.toString('ascii'))

    app.mongodb.insert(topic.substring(3), payload)

    console.log(payload)
    switch (topic) {
      case 'st/traffic_light':
        app.states[payload.slug] = payload
        app.socket.emit(`tl_${payload.slug}`, 'change_state', payload)

        break
    }
  })

  this.client.subscribe('st/traffic_light')
  this.client.subscribe('st/traffic_sensor')
  this.client.subscribe('st/cross')

  this.publish = async (channel, payload) => {
    this.client.publish(channel, Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64'))
  }

  return this
}

module.exports = mqttClient
