const express = require('express')
const router = require('./router')
var cors = require('cors')
var app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use(cors())
const port = 4098
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router)





app.listen(port, () => {
  console.log(`Example app listening on port ${4098}`)
})