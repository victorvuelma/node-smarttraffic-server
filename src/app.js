const dotenv = require('dotenv')
dotenv.config()

const app = () => {
  this.http = require('./server/http')
  this.socket = require('./server/socket')(this)
  this.mqtt = require('./client/mqtt')(this)

  this.states = {}

  this.http.listen(process.env.PORT || 8000)
}

app()
