const dotenv = require('dotenv')
dotenv.config()

class App {
	
	init = () => {
		this.http = require('./server/http')
		this.socket =  require('./server/socket')(this)
		this.mqtt = require('./client/mqtt')(this)

		console.log(mqtt)

		this.states = {}

		this.http.listen(process.env.PORT || 8000)
	}
}

new App().init()
