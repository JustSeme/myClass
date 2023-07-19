import { injectable } from "inversify"
import { Response, Request } from "express"
import { HTTP_STATUSES } from "../../settings"
import { LessonsService } from "../../application/lessons-service"
import { LessonsQueryRepository } from "../../infractructure/lessons-query-repository"

@injectable()
export class LessonsController {
    constructor(
        private lessonsService: LessonsService,
        private lessonsQueryRepository: LessonsQueryRepository,
    ) { }


    async findLessons(req: Request, res: Response<any>): Promise<void> {
        res.status(HTTP_STATUSES.OK_200).send('hello world')
        return
    }

    async createLessons(req: Request, res: Response<{ lessonIds: number[] }>): Promise<void> {
        const lessonIds = await this.lessonsService.createLessons(req)

        if (!lessonIds.length) {
            res.sendStatus(HTTP_STATUSES.NOT_IMPLEMENTED_501)
            return
        }

        res.send({
            lessonIds: lessonIds
        })

        return
    }
}