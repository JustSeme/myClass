import moment from "moment"
import { server } from "../../src/app"
import { LessonsViewModel } from "../../src/application/models/LessonsViewModel"
import { TeacherViewModel } from "../../src/application/models/TeacherViewModel"
import { HTTP_STATUSES, app } from "../../src/settings"
import { clearDB, prepareDBWithTestDump } from "../test-utils"
import request from "supertest"

describe('find-lessons', () => {
    beforeAll(async () => {
        await clearDB()
        await prepareDBWithTestDump()
    })

    afterAll(async () => {
        await server.close()
    })

    it('testing pagination, default pagination', async () => {
        const findedLessons = await request(app)
            .get('/')
            .expect(HTTP_STATUSES.OK_200)

        expect(findedLessons.body.length).toEqual(5)
        expect(findedLessons.body).toEqual([
            {
                id: 1,
                date: '2019-09-01',
                title: 'Green Color',
                status: 1,
                visitsCount: 2,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 2,
                date: '2019-09-02',
                title: 'Red Color',
                status: 0,
                visitsCount: 2,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 3,
                date: '2019-09-03',
                title: 'Orange Color',
                status: 1,
                visitsCount: 0,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 4,
                date: '2019-09-04',
                title: 'Blue Color',
                status: 1,
                visitsCount: 4,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 5,
                date: '2019-05-10',
                title: 'Purple Color',
                status: 0,
                visitsCount: 0,
                students: expect.any(Array),
                teachers: expect.any(Array)
            }
        ])

        const findedLessons2 = await request(app)
            .get('/?page=2')
            .expect(HTTP_STATUSES.OK_200)

        expect(findedLessons2.body.length).toEqual(5)
        expect(findedLessons2.body).toEqual([
            {
                id: 6,
                date: '2019-05-15',
                title: 'Red Color',
                status: 1,
                visitsCount: 0,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 7,
                date: '2019-06-17',
                title: 'White Color',
                status: 0,
                visitsCount: 2,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 8,
                date: '2019-06-17',
                title: 'Black Color',
                status: 1,
                visitsCount: 2,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 9,
                date: '2019-06-20',
                title: 'Yellow Color',
                status: 1,
                visitsCount: 0,
                students: expect.any(Array),
                teachers: expect.any(Array)
            },
            {
                id: 10,
                date: '2019-06-24',
                title: 'Brown Color',
                status: 0,
                visitsCount: 1,
                students: expect.any(Array),
                teachers: expect.any(Array)
            }
        ])

        const findedLesonsWithPageSize2 = await request(app)
            .get('/?lessonsPerPage=2')
            .expect(HTTP_STATUSES.OK_200)

        expect(findedLesonsWithPageSize2.body.length).toEqual(2)

        const findedLesonsWithPageSize2AndPage2 = await request(app)
            .get('/?lessonsPerPage=2&page=2')
            .expect(HTTP_STATUSES.OK_200)

        expect(findedLesonsWithPageSize2AndPage2.body.length).toEqual(2)
    })

    it('test studentsCount validation', async () => {
        const errorsMessages1 = await request(app)
            .get('/?studentsCount=one')
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages1.body).toEqual({
            errorsMessages: [{
                message: 'Every studentsCount element should be a number',
                field: 'studentsCount',
            }]
        })

        const errorsMessages2 = await request(app)
            .get('/?studentsCount=1,2,3')
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages2.body).toEqual({
            errorsMessages: [{
                field: 'studentsCount',
                message: 'StudentsCount quantity should be lower than 2'
            }]
        })
    })

    it('test studentsCount queryParam', async () => {
        const findedLessonsWithStudentsCount2 = await request(app)
            .get('/?studentsCount=2')
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithStudentsCount2.body.forEach((lesson: LessonsViewModel) => {
            expect(lesson.students.length).toEqual(2)
        })

        const findedLessonsWithStudentsCount0To2 = await request(app)
            .get('/?studentsCount=0,2')
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithStudentsCount0To2.body.forEach((lesson: LessonsViewModel) => {
            expect(lesson.students.length >= 0 && lesson.students.length <= 2).toEqual(true)
        })
    })

    it('test teacherIdsValidation', async () => {
        const errorsMessages = await request(app)
            .get('/?teacherIds=one')
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages.body).toEqual({
            errorsMessages: [{
                message: 'Every teacherId should be a number',
                field: 'teacherIds'
            }]
        })
    })

    it('test teacherIds', async () => {
        const findedLessonsWithTeacherIds1 = await request(app)
            .get('/?teacherIds=1')
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithTeacherIds1.body.forEach((lesson: LessonsViewModel) => {
            const isTeacherId1Exists = lesson.teachers.some((teacher: TeacherViewModel) => teacher.id === 1)
            expect(isTeacherId1Exists).toEqual(true)
        })

        const findedLessonsWithTeacherIds2Or4 = await request(app)
            .get('/?teacherIds=2,4')
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithTeacherIds2Or4.body.forEach((lesson: LessonsViewModel) => {
            const isTeacherId2Or4Exists = lesson.teachers.some((teacher: TeacherViewModel) => (teacher.id === 2 || teacher.id === 4))
            expect(isTeacherId2Or4Exists).toEqual(true)
        })
    })

    it('test status query param validation', async () => {
        const errorsMessages = await request(app)
            .get('/?status=one')
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages.body).toEqual({
            errorsMessages: [{
                message: 'Status should be a integer',
                field: 'status'
            }]
        })
    })

    it('test status query param', async () => {
        const findedLessonsWithStatus1 = await request(app)
            .get('/?status=1')
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithStatus1.body.forEach((lesson: LessonsViewModel) => {
            expect(lesson.status).toEqual(1)
        })

        const findedLessonsWithStatus0 = await request(app)
            .get('/?status=0')
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithStatus0.body.forEach((lesson: LessonsViewModel) => {
            expect(lesson.status).toEqual(0)
        })
    })

    it('test date query param validation', async () => {
        const errorsMessages1 = await request(app)
            .get('/?date=123')
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages1.body).toEqual({
            errorsMessages: [{
                message: 'Date should be a date',
                field: 'date'
            }]
        })

        const errorsMessages2 = await request(app)
            .get('/?date=2023-24-07,2023-25-07,2023-26-7')
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        expect(errorsMessages2.body).toEqual({
            errorsMessages: [{
                message: 'Date quantity should be lower than 2',
                field: 'date'
            }]
        })
    })

    it('test date query param', async () => {
        const oneDateValue = '2019-06-17'

        const findedLessonsWithDate = await request(app)
            .get(`/?date=${oneDateValue}`)
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithDate.body.forEach((lesson: LessonsViewModel) => {
            expect(lesson.date).toEqual(oneDateValue)
        })

        const twoDatesValue1 = '2019-05-10',
            twoDatesValue2 = '2019-05-17'

        const findedLessonsWithDateOneToTwo = await request(app)
            .get(`/?${twoDatesValue1},${twoDatesValue2}`)
            .expect(HTTP_STATUSES.OK_200)

        findedLessonsWithDateOneToTwo.body.forEach((lesson: LessonsViewModel) => {
            expect(moment(lesson.date) >= moment(twoDatesValue1) || moment(lesson.date) <= moment(twoDatesValue2)).toEqual(true)
        })
    })
})