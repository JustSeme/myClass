import { Client } from 'pg'

export let client: Client

const PG_PASSWORD = process.env.PG_PASSWORD
const PG_USER_NAME = process.env.PG_USER_NAME

const DB_PORT = Number(process.env.DB_PORT)
const DB_NAME = process.env.DB_NAME
export const dbSettings = {
    port: DB_PORT,
    password: PG_PASSWORD,
    user: PG_USER_NAME,
    database: DB_NAME
}
export async function runDB() {
    try {
        client = new Client(dbSettings)

        await client.connect()

        console.log('Postgres DB connected succesfully');
    } catch (err) {
        console.log('Postgres DB not connected')
        console.error(err)
    }

}