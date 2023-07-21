import { server } from '../../src/app'
import request from 'supertest'
import { app } from '../../src/settings'
import { CreateLessonsInputModel } from '../../src/api/models/CreateLessonsInputModel'

describe('/lessons', () => {
    beforeAll(async () => {
        await request(app)
            .delete(`/clear-lessons`)
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

    it('Should create one lesson', async () => {
        await request(app)
            .post('/lessons')
            .send(createOneLessonInputModel)
    })
})