const express = require('express')
const routes = require('./routes') // Impor rute

const app = express()
app.use(express.json())
app.use(routes) // Pakai rute di sini

app.listen(9000, () => {
  console.log('Server berjalan pada port 9000')
})
