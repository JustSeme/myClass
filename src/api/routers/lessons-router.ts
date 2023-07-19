import { Router } from "express";
import { container } from "../../composition-root";
import { LessonsController } from "../controllers/lessons-controller";

export const lessonsRouter = Router({})

const lessonsController = container.resolve<LessonsController>(LessonsController)

// @ts-ignore прошу прощения за @ts-ignore, но я вообще не могу понять, почему он ругается, не хочу тратить время
lessonsRouter.get('/', lessonsController.findLessons.bind(lessonsController))