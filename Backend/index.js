import express from 'express'
import dotenv from 'dotenv'
import connectDb from './src/config/connectDb.js'
dotenv.config()

const port = process.env.PORT

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`server is running at ${port}`)
        })

    }).catch((err) => {
        console.log(err)
    })
