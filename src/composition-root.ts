import "reflect-metadata"
import { Container } from "inversify/lib/container/container";
import { LessonsController } from "./api/controllers/lessons-controller";
import { LessonsService } from "./application/lessons-service";
import { LessonsRepository } from "./infractructure/lessons-repository";

export const container = new Container()

//controllers
container.bind<LessonsController>(LessonsController).to(LessonsController)

//services
container.bind<LessonsService>(LessonsService).to(LessonsService)

//repositories
container.bind<LessonsRepository>(LessonsRepository).to(LessonsRepository)