import { body } from "express-validator";
import moment from "moment";
import { dateFormat } from "../../helpers";
import { LessonsQueryRepository } from "../../infractructure/lessons-query-repository";

// По хорошему бы инжектить этот репозиторий чтоб можно было удобно его подменить, но express-validator вряд ли такое поддерживает, в проде так не делаю
const lessonsQueryRepository = new LessonsQueryRepository()

export const teacherIdsBodyValidator = body('teacherIds')
    .custom(async (teacherIds) => {
        if (!Array.isArray(teacherIds)) {
            throw new Error('TeacherIds should be an numbers Array')
        }

        if (!teacherIds.length) {
            throw new Error('TeacherIds should\'t be empty')
        }

        for (let i = 0; i < teacherIds.length; i++) {
            if (isNaN(teacherIds[i])) {
                throw new Error('Every id should be a number')
            }

            // По хорошему бы создать teachersRepository, но заданием не предусмотрены операции с ресурсом teachers, так что ладно
            if (!(await lessonsQueryRepository.isTeacherExists(teacherIds[i]))) {
                throw new Error(`Teacher by id ${teacherIds[i]} does not exists`)
            }
        }
        return true
    })

export const titleBodyValidator = body('title')
    .exists().withMessage('Title is required')
    .isString().withMessage('Title should be a string')
    .isLength({ min: 1 }).withMessage('Title should be not empty')

export const daysBodyValidator = body('days')
    .exists().withMessage('Days is required')
    .isArray({ min: 1, max: 7 }).withMessage('Days should be an not empty Array')
    .isInt().withMessage('Days should be an numbers Array')
    .custom(days => {
        days.forEach((day: number) => {
            if (day > 6 || day < 0) {
                throw new Error('The days should be in the range from 0 to 6')
            }
        })
        return true
    })

export const firstDateBodyValidator = body('firstDate')
    .exists().withMessage('FirstDate is required')
    .custom((firstDate) => {
        if (!moment(firstDate, dateFormat, true).isValid()) {
            throw new Error('FirstDate should be a Date format YYYY-MM-DD')
        }
        return true
    })

export const lastDateBodyValidator = body('lastDate')
    .optional()
    .custom((lastDate) => {
        if (!moment(lastDate, dateFormat, true).isValid()) {
            throw new Error('LastDate should be a Date format YYYY-MM-DD')
        }
        return true
    })

export const lessonsCountBodyValidator = body('lessonsCount')
    .optional()
    .isInt({ min: 1, max: 300 }).withMessage('LessonsCount should be a number greater than 1 and lower then 300')