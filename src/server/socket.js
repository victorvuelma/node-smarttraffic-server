const socket = require('socket.io')

const init = (app) => {
	const io = socket(app.http)

	io.on('connection', client => {
		
		client.on('connectTraffic', slug => {
			client.join(`tl_${slug}`)

			client.emit('change_state', app.states[slug] || '')
		})
	
		client.on('alterState', data => {
			console.log(app)

			app.mqtt.publish('st/cross', { run: 'alter_state', ...data})
		})
	})

	return io	
}

module.exports = init