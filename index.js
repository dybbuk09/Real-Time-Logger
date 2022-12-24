const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
require('dotenv').config()
const { Log } = require('./be/models/Log')
const moment = require('moment')
const multer = require('multer')
const MQ = require('./be/queue/MQ')

const APP_PORT = process.env.APP_PORT || 8000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer().array())
app.use(express.static(path.join(__dirname, 'fe/build')))

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'fe/build/index.html'))
})

app.post('/save-error', async (request, response) => {
    try {
        const result = await Log({
            loggerId: request.body.loggerId,
            error: request.body.error,
            createdAt: request.body.time
                ? moment(request.body.time).valueOf()
                : moment().valueOf()
        }).save()

        const queueName = `logs-queue-${parseInt(request.body.loggerId)}`
        
        const mq = new MQ()
        const queue = await mq.queue(queueName)
        queue.sendMessage(JSON.stringify(result))
        await queue.close()
        response.send({
            success: true
        })
        
    } catch (error) {
        console.log(error.stack)
        response.send({
            success: false
        })
    }
})

app.get('/errors/:id/:chunked?', async (request, response) => {
    try {
        let id = request.params.id

        if (request.params.chunked == null || request.params.chunked == undefined) {
            const result = await fetchLogs(id, true, true)
            response.send({ data: result })
            return
        } else {

            response.setHeader("Cache-Control", "no-cache")
            response.setHeader("Content-Type", "text/event-stream")
            response.setHeader("Connection", "keep-alive")

            const queueName = `logs-queue-${id}`
            const mq = new MQ()
            await mq.queue(queueName)

            mq.channel.consume(queueName, data => {
                response.write("data: " + `${Buffer.from(data.content)}\n\n`)
                mq.channel.ack(data);
            })
        }
    } catch (error) {
        console.log(error.stack)
    }
})

app.listen(APP_PORT, () => {
    console.log(`Server is running on PORT ${APP_PORT}`)
})

const fetchLogs = async (loggerId, time = 5) => {
    try {
        const fields = {
            loggerId: loggerId,
            createdAt: {
                $gt: (moment().valueOf() - 1000 * 60 * time)
            }
        }
        return await Log.find(fields)
    } catch (error) {
        console.log(error.stack)
        return []
    }
}