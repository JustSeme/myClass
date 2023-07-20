import { Router } from "express";
import { container } from "../../composition-root";
import { LessonsController } from "../controllers/lessons-controller";
import { dateQueryValidator, lessonsPerPageQueryValidator, pageQueryValidator, statusQueryValidator, studentsCountQueryValidator, teacherIdsQueryValidator } from "../validation/find-lessons-validators";
import { inputValidationMiddleware } from "../validation/input-validation-middleware";
import { daysBodyValidator, firstDateBodyValidator, lastDateBodyValidator, lessonsCountBodyValidator, teacherIdsBodyValidator, titleBodyValidator } from "../validation/create-lessons-validators";

export const lessonsRouter = Router({})

const lessonsController = container.resolve<LessonsController>(LessonsController)

lessonsRouter.get('/',
    dateQueryValidator,
    statusQueryValidator,
    teacherIdsQueryValidator,
    studentsCountQueryValidator,
    pageQueryValidator,
    lessonsPerPageQueryValidator,
    inputValidationMiddleware,
    lessonsController.findLessons.bind(lessonsController))

lessonsRouter.post('/lessons',
    titleBodyValidator,
    daysBodyValidator,
    teacherIdsBodyValidator,
    firstDateBodyValidator,
    lastDateBodyValidator,
    lessonsCountBodyValidator,
    inputValidationMiddleware,
    lessonsController.createLessons.bind(lessonsController)
)