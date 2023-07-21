import dotenv from 'dotenv'
dotenv.config()
import { runDB } from './infractructure/db'
import { app, settings } from './settings'

const port = settings.PORT

export let server: any
const startApp = async () => {
    await runDB()
    server = app.listen(port, () => {
        console.log(`MyClass app listening on port ${port}`);
    })
}

startApp()