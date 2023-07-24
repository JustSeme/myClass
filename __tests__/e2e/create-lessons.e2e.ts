import { server } from '../../src/app'
import request from 'supertest'
import { HTTP_STATUSES, app } from '../../src/settings'
import { CreateLessonsInputModel } from '../../src/api/models/CreateLessonsInputModel'
import { client } from '../../src/infractructure/db'
import { clearDB } from '../test-utils'
import moment from 'moment'

describe('create-lessons', () => {
    beforeAll(async () => {
        await clearDB()
    })

    afterAll(async () => {
        await server.close()
    })

    const createOneLessonInputModel: CreateLessonsInputModel = {
        days: [0],
        firstDate: '2023-07-21',
        lessonsCount: 1,
        teacherIds: [1, 2],
        title: 'lesson Title'
    }

    // Можно было бы до бесконечности тестировать мою валидацию, но я по минимому пройдусь по каждому входному параметру
    it('Should\'t create lessons if input model has incorrect values', async () => {
        const errorsMessages = await request(app)
            .post('/lessons')
            .send(createOneLessonInputModel)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages.body).toEqual({
            errorsMessages: [{
                message: 'Teacher by id 1 does not exists',
                field: 'teacherIds'
            }]
        })

        await client.query(`
            INSERT INTO public.teachers
                (id, name)
                VALUES (1, 'Sveta'),
                        (2, 'Kirill');
        `)

        const incorrectInputModelWithEmptyDays = { ...createOneLessonInputModel, days: [] }

        const errorsMessages2 = await request(app)
            .post('/lessons')
            .send(incorrectInputModelWithEmptyDays)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages2.body).toEqual({
            errorsMessages: [{
                message: 'Days should be an not empty Array',
                field: 'days'
            }]
        })

        const incorrectInputModelWithoutFirstDate = { ...createOneLessonInputModel, firstDate: null }

        const errorsMessages3 = await request(app)
            .post('/lessons')
            .send(incorrectInputModelWithoutFirstDate)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages3.body).toEqual({
            errorsMessages: [{
                message: 'FirstDate should be a Date format YYYY-MM-DD',
                field: 'firstDate'
            }]
        })

        const incorrectInputModelWithLessonsCountGreaterThan300 = { ...createOneLessonInputModel, lessonsCount: 301 }

        const errorsMessages4 = await request(app)
            .post('/lessons')
            .send(incorrectInputModelWithLessonsCountGreaterThan300)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages4.body).toEqual({
            errorsMessages: [{
                message: 'LessonsCount should be a number greater than 1 and lower then 300',
                field: 'lessonsCount'
            }]
        })

        const incorrectInputModelWithIncorrectLastDate = { ...createOneLessonInputModel, lastDate: '22-03-2023' }

        const errorsMessages5 = await request(app)
            .post('/lessons')
            .send(incorrectInputModelWithIncorrectLastDate)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages5.body).toEqual({
            errorsMessages: [{
                message: 'LastDate should be a Date format YYYY-MM-DD',
                field: 'lastDate'
            }]
        })

        const incorrectInputModelWithIncorrectTitle = { ...createOneLessonInputModel, title: 2 }

        const errorsMessages6 = await request(app)
            .post('/lessons')
            .send(incorrectInputModelWithIncorrectTitle)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages6.body).toEqual({
            errorsMessages: [{
                message: 'Title should be a string',
                field: 'title'
            }]
        })

        const createOneLessonInputModelWithTwoExclusiveParameters = { ...createOneLessonInputModel, lastDate: '2023-07-25' }

        await request(app)
            .post('/lessons')
            .send(createOneLessonInputModelWithTwoExclusiveParameters)
            .expect(HTTP_STATUSES.NOT_IMPLEMENTED_501)
    })

    let lessonId1
    it('Should create one lesson for teachers 1 and 2, returning ids array, lessons and teacher_lessons should appear in tables', async () => {
        const createdLessonIds = await request(app)
            .post('/lessons')
            .send(createOneLessonInputModel)
            .expect(HTTP_STATUSES.OK_200)

        const { lessonIds } = createdLessonIds.body

        expect(Array.isArray(lessonIds)).toEqual(true)
        expect(lessonIds.length).toEqual(1)
        expect(typeof lessonIds[0]).toEqual('number')

        lessonId1 = lessonIds[0]

        const lessonsData = await client.query(`
            SELECT id FROM public.lessons
        `)

        expect(lessonsData.rows[0].id).toEqual(lessonId1)

        const lesson_teachersData = await client.query(`
            SELECT * FROM public.lesson_teachers
        `)

        expect(lesson_teachersData.rows[0].lesson_id).toEqual(lessonId1)
        expect(lesson_teachersData.rows[1].lesson_id).toEqual(lessonId1)
        expect(lesson_teachersData.rows[0].teacher_id).toEqual(1)
        expect(lesson_teachersData.rows[1].teacher_id).toEqual(2)
    })

    const createLessonsInputModel = {
        days: [1, 2, 3],
        firstDate: '2023-07-21',
        lastDate: '2024-07-21',
        teacherIds: [1, 2],
        title: 'lesson Title'
    }

    it('should create 156 lessons for the year ahead by days 1, 2, 3', async () => {
        const createdLessonIds = await request(app)
            .post('/lessons')
            .send(createLessonsInputModel)
            .expect(HTTP_STATUSES.OK_200)

        const { lessonIds } = createdLessonIds.body
        expect(lessonIds.length).toEqual(156)

        const lessonsData = await client.query('SELECT * from public.lessons ORDER BY id DESC')

        expect(lessonsData.rows.length).toEqual(157)
        const lessonDays = lessonsData.rows.map(lesson => moment(lesson.date).day())

        expect(lessonDays[2]).toEqual(createLessonsInputModel.days[0])
        expect(lessonDays[1]).toEqual(createLessonsInputModel.days[1])
        expect(lessonDays[0]).toEqual(createLessonsInputModel.days[2])
    })

    it('should create 300 lessons for a period of 1 year and lessons every day', async () => {
        const createLessonsInputModelEveryDay = { ...createLessonsInputModel, days: [0, 1, 2, 3, 4, 5, 6] }

        const createdLessonIds = await request(app)
            .post('/lessons')
            .send(createLessonsInputModelEveryDay)
            .expect(HTTP_STATUSES.OK_200)

        const { lessonIds } = createdLessonIds.body
        expect(lessonIds.length).toEqual(300)
    })

    const createLessonsWithLessonsCount300 = {
        days: [1],
        firstDate: '2023-07-24',
        lessonsCount: 300,
        teacherIds: [1, 2],
        title: 'lesson Title'
    }

    it('should create 52 lessons for a lessons count 300, check constraint - lessons can create only for a one year ahead', async () => {
        const createdLessonIds = await request(app)
            .post('/lessons')
            .send(createLessonsWithLessonsCount300)
            .expect(HTTP_STATUSES.OK_200)

        const { lessonIds } = createdLessonIds.body

        expect(lessonIds.length).toEqual(53)
    })
})