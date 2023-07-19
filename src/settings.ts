import express, { Request, Response } from "express"
import { lessonsRouter } from "./api/routers/lessons-router"
import cookieParser from "cookie-parser"

export const settings = {
    PORT: process.env.PORT || 4000,
}

export const baseURL = '/api/'

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    TOO_MANY_REQUESTS_429: 429,

    NOT_IMPLEMENTED_501: 501
}

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.set('trust proxy', true)


app.delete('/api/prepare-db', async (req: Request, res: Response) => {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.get(`/`, lessonsRouter)
