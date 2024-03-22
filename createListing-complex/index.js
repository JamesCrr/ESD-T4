const express = require('express')
const router = require('./router')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var cors = require('cors')
var app = express()

app.use(cors())
const port = 4099
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Example app listening on port ${4099}`)
})