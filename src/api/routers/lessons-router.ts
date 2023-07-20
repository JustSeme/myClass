import { Router } from "express";
import { container } from "../../composition-root";
import { LessonsController } from "../controllers/lessons-controller";
import { dateQueryValidator, lessonsPerPageQueryValidator, pageQueryValidator, statusQueryValidator, studentsCountQueryValidator, teacherIdsQueryValidator } from "../validation/validators";
import { inputValidationMiddleware } from "../validation/input-validation-middleware";

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