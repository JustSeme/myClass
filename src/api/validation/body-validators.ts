import { body } from "express-validator";
import moment from "moment";
import { dateFormat } from "../../helpers";

export const teacherIdsBodyValidator = body('teacherIds')
    .exists().withMessage('TeacherIds is required')
    .isArray({ min: 1 }).withMessage('TeacherIds should be an not empty Array')
    .isInt().withMessage('TeacherIds should be an numbers Array')

export const titleBodyValidator = body('title')
    .exists().withMessage('Title is required')
    .isString().withMessage('Title should be a string')
    .isLength({ min: 1 }).withMessage('Title should be not empty')

export const daysBodyValidator = body('days')
    .exists().withMessage('Days is required')
    .isArray({ min: 1 }).withMessage('Days should be an not empty Array')
    .isInt().withMessage('Days should be an numbers Array')

export const firstDateBodyValidator = body('fistDate')
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
    .isInt()