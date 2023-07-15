const fs = require('fs')
const express = require('express')
const pino = require('pino-http')
const cors = require('cors')
const userRouter = require('./router/user')
const noteRouter = require('./router/note')
const joi = require('@hapi/joi')
const expressJWT = require('express-jwt')
const config = require('./config')

const app = express()

PORT = 3000

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    res.charset = 'utf-8'
    next()
})


app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\/(login|regUser)$/] }))

const fileStream = fs.createWriteStream('logs.txt')
const logger = pino({ stream: fileStream });
app.use(logger)

app.use('/api', userRouter)
app.use('/api', noteRouter)

app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    if (err.name === 'UnauthorizedError') return res.cc("身份验证失败")
})


app.listen(PORT, () => {
    console.log(`api server running at http://127.0.0.1:${PORT}`)
})
