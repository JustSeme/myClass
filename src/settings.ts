import express, { Request, Response } from "express"
import { lessonsRouter } from "./api/routers/lessons-router"
import { client } from "./infractructure/db"

export const settings = {
    PORT: process.env.PORT || 4000,
}

export const baseURL = '/api/'

export const HTTP_STATUSES = {
    OK_200: 200,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,

    NOT_IMPLEMENTED_501: 501
}

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.set('trust proxy', true)

app.use(lessonsRouter)
