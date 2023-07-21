import express, { Request, Response } from "express"
import { lessonsRouter } from "./api/routers/lessons-router"
import { client } from "./infractructure/db"

export const settings = {
    PORT: process.env.PORT || 4000,
}

export const baseURL = '/api/'

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    NOT_FOUND_404: 404,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    TOO_MANY_REQUESTS_429: 429,

    NOT_IMPLEMENTED_501: 501
}

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.set('trust proxy', true)


// Наполняю базу изначальным тестовым дампом
app.delete('/prepare-db', async (req: Request, res: Response) => {
    await client.query(`
        DELETE FROM public.lesson_students;
        DELETE FROM public.lesson_teachers;
        DELETE FROM public.students;
        DELETE FROM public.teachers;
        DELETE FROM public.lessons;
    `)

    const insertTeachersString = `
    (1,	'Sveta'),
    (2,	'Marina'),
    (3,	'Angelina'),
    (4,	'Masha');
    `

    await client.query(`
    INSERT INTO public.teachers
    (id, name)
    VALUES ${insertTeachersString}
    `)

    const insertStudentsString = `
    (1,	'Ivan'),
    (2,	'Sergey'),
    (3,	'Maxim'),
    (4,	'Slava');
    `

    await client.query(`
    INSERT INTO public.students
        (id, name)
        VALUES ${insertStudentsString}
    `)

    const insertLessonsString = `
    (2,	'2019-09-02',	'Red Color',	0),
    (5,	'2019-05-10',	'Purple Color',	0),
    (7,	'2019-06-17',	'White Color',	0),
    (10,	'2019-06-24',	'Brown Color',	0),
    (9,	'2019-06-20',	'Yellow Color',	1),
    (1,	'2019-09-01',	'Green Color',	1),
    (3,	'2019-09-03',	'Orange Color',	1),
    (4,	'2019-09-04',	'Blue Color',	1),
    (6,	'2019-05-15',	'Red Color', 1),
    (8,	'2019-06-17',	'Black Color',	1);
    `

    await client.query(`
    INSERT INTO public.lessons(
        id, date, title, status)
        VALUES ${insertLessonsString};
    `)

    const insertLessonStudentsString = `
    (1,	1,	true),
    (1,	2,	true),
    (1,	3,	false),
    (2,	2,	true),
    (2,	3,	true),
    (4,	1,	true),
    (4,	2,	true),
    (4,	3,	true),
    (4,	4,	true),
    (5,	4,	false),
    (5,	2,	false),
    (6,	1,	false),
    (6,	3,	false),
    (7,	2,	true),
    (7,	1,	true),
    (8,	1,	false),
    (8,	4,	true),
    (8,	2,	true),
    (9,	2,	false),
    (10,	1,	false),
    (10,	3,	true);
    `

    await client.query(`
    INSERT INTO public.lesson_students(
        lesson_id, student_id, visit)
        VALUES ${insertLessonStudentsString};
    `)

    const insertLessonTeachersString = `
    (1,	1),
    (1,	3),
    (2,	1),
    (2,	4),
    (3,	3),
    (4,	4),
    (6,	3),
    (7,	1),
    (8,	4),
    (8,	3),
    (8,	2),
    (9,	3),
    (10,	3);
    `

    await client.query(`
    INSERT INTO public.lesson_teachers(
        lesson_id, teacher_id)
        VALUES ${insertLessonTeachersString};
    `)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

app.use(lessonsRouter)
