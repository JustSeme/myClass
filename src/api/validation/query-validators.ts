import { query } from 'express-validator'
import moment from 'moment'

export const dateQueryValidator = query('date')
    .optional()
    .custom((dateValue: string) => {
        // date param contains two dates
        const dateValuesArray = dateValue.split(',')

        if (dateValuesArray.length > 2) {
            throw new Error('Date quantity should be lower than 2')
        }

        const dateFormat = 'YYYY-MM-DD'
        dateValuesArray.forEach(date => {
            if (!moment(date, dateFormat, true).isValid()) {
                throw new Error('Date should be a date')
            }
        })
        return true
    })

export const statusQueryValidator = query('status')
    .optional()
    .custom((status: string) => {
        if (!(+status === 0 || +status === 1)) {
            throw new Error('Status should be a integer')
        } else {
            return true
        }
    })

export const teacherIdsQueryValidator = query('teacherIds')
    .optional()
    .custom((stringIds) => {
        const idsArray = stringIds.split(',')

        idsArray.forEach((id: string) => {

            if (isNaN(+id) || id === '') {
                throw new Error('Every teacherId should be a number')
            }
        });
        return true
    })

export const studentsCountQueryValidator = query('studentsCount')
    .optional()
    .custom((studentsCountString) => {
        const studentsCountArray = studentsCountString.split(',')

        if (studentsCountArray.length > 2) {
            throw new Error('StudentsCount quantity should be lower than 2')
        }

        studentsCountArray.forEach((studentsCount: string) => {
            if (isNaN(+studentsCount)) {
                throw new Error('Every studentsCount element should be a number')
            }
        })
        return true
    })

export const pageQueryValidator = query('page')
    .optional()
    .isInt()

export const lessonsPerPageQueryValidator = query('lessonsPerPage')
    .optional()
    .isInt()