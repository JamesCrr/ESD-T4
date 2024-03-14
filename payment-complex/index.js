const express = require('express')
const router = require('./router')
var cors = require('cors')
var app = express()

app.use(cors())
const port = 4098
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router)




app.listen(port, () => {
  console.log(`Example app listening on port ${4000}`)
})