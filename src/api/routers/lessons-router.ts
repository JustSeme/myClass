import { Router } from "express";
import { container } from "../../composition-root";
import { LessonsController } from "../controllers/lessons-controller";
import { dateQueryValidator, lessonsPerPageQueryValidator, pageQueryValidator, statusQueryValidator, studentsCountQueryValidator, teacherIdsQueryValidator } from "../validators";

export const lessonsRouter = Router({})

const lessonsController = container.resolve<LessonsController>(LessonsController)

lessonsRouter.get('/',
    dateQueryValidator,
    statusQueryValidator,
    teacherIdsQueryValidator,
    studentsCountQueryValidator,
    pageQueryValidator,
    lessonsPerPageQueryValidator,
    lessonsController.findLessons.bind(lessonsController))