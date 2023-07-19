import { injectable } from "inversify"
import { client } from "../repositories/db"

@injectable()
export class LessonsQueryRepository {

    async findLessons() {
        // Чет не нашёл как по DI инжектить сюда DataSource, так что вот так. typeORM мне в этом плане, конечно, больше нравится
        const lessonsData = await client.query('')
    }
}