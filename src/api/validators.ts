import { query } from 'express-validator'
import moment from 'moment'

export const dateQueryValidator = query('date')
    .custom((dateValue: string) => {
        // date param contains two dates
        const dateValuesArray = dateValue.split(',')

        if (dateValuesArray.length > 2) {
            return false
        }

        dateValuesArray.forEach(date => {
            if (!moment(date).isValid()) {
                return false
            }
        })
        return true
    })
    .withMessage('Parameter date should be Date and elements quantity in this parameter should be lower then 2')

export const statusQueryValidator = query('status')
    .custom((status: string) => +status === 0 || +status === 1)
    .withMessage('Parameter status should be equal 0 or 1')

export const teacherIdsQueryValidator = query('teacherIds')
    .custom((stringIds) => {
        const idsArray = stringIds.split(',')

        idsArray.forEach((id: string) => {
            if (isNaN(+id)) {
                return false
            }
        });
        return true
    })
    .withMessage('All teacherIds should be integer')

export const studentsCountQueryValidator = query('studentsCount')
    .custom((studentsCountString) => {
        const studentsCountArray = studentsCountString.split(',')

        if (studentsCountArray.length > 2) {
            return false
        }

        studentsCountArray.forEach((studentsCount: string) => {
            if (isNaN(+studentsCount)) {
                return false
            }
        })
        return true
    })
    .withMessage('studentsCount should be a number and elements quantity in this parameter should be lower then 2')

export const pageQueryValidator = query('page')
    .isInt()

export const lessonsPerPageQueryValidator = query('lessonsPerPage')
    .isInt()