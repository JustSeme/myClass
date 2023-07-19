import dotenv from 'dotenv'
dotenv.config()
import { runDB } from './repositories/db'
import { app, settings } from './settings'

const port = settings.PORT

const startApp = async () => {
    await runDB()
    app.listen(port, () => {
        console.log(`MyClass app listening on port ${port}`);
    })
}

startApp()