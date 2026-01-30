import express from 'express'
import dotenv from 'dotenv'
import connectDb from './src/config/connectDb.js'
import cors from 'cors'
import authRouter from './src/routes/auth.routes.js'
dotenv.config()

const port = process.env.PORT

const app = express()
app.use(cors())

app.use("/api/auth", authRouter);

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
