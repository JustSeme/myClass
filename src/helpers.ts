import moment from "moment"
import { GetLessonsQueryType } from "./api/models/GetLessonsQueryModel"

const prepareStudentsCount = (param: string): number[] => {
    const parameterArray = param.split(',')
    if (parameterArray[0] === '') {
        return []
    }
    return parameterArray.map(parameter => Number(parameter))
}

const prepareTeacherIds = (teacherIds: string): string | null => {
    const teacherIdsArray = teacherIds.split(',')
    if (!teacherIdsArray[0]) {
        return null
    }

    const resultedStr = `'${teacherIdsArray.join("', '")}'`

    return resultedStr
}

const prepareDate = (date: string): string[] => {
    const datesArray = date.split(',')
    if (!datesArray[0]) {
        return []
    }

    return datesArray
}

export const prepareAllQueryParams = (lessonsQueryParams: GetLessonsQueryType): PreparedQueryStringsAndParamsType => {
    let {
        date = '', status = -1, teacherIds = '', studentsCount = '', page = 1, lessonsPerPage = 5
    } = lessonsQueryParams

    const skipCount = (+page - 1) * +lessonsPerPage

    const preparedStudentCount = prepareStudentsCount(studentsCount)
    const preparedTeacherIds = prepareTeacherIds(teacherIds)
    const preparedDate = prepareDate(date)

    const parametersArray = [lessonsPerPage, skipCount]

    let studentsCountQueryString = ''
    if (preparedStudentCount.length) {
        parametersArray.push(preparedStudentCount[0])
        studentsCountQueryString = `HAVING count(s.id) = $${parametersArray.length}`

        if (preparedStudentCount[1]) {
            parametersArray.push(preparedStudentCount[1])
            studentsCountQueryString = `HAVING count(s.id) >= $${parametersArray.length - 1} AND count(s.id) <= $${parametersArray.length}`
        }
    }

    let teacherIdsQueryString = ''
    if (preparedTeacherIds?.length) {
        // Сделал конатенацию вместо использования параметров, сомневаюсь, что здесь возможен SQL-Injection
        teacherIdsQueryString = `WHERE te.id IN (${preparedTeacherIds})`
    }

    let statusQueryString = ''
    if (status !== -1) {
        parametersArray.push(status)
        statusQueryString = `WHERE l.status = $${parametersArray.length}`
    }

    let dateQueryString = ''
    if (preparedDate.length) {
        parametersArray.push(preparedDate[0])
        dateQueryString = `WHERE l.date = $${parametersArray.length}`
        if (preparedDate[1]) {
            parametersArray.push(preparedDate[1])
            dateQueryString = `WHERE l.date >= $${parametersArray.length - 1} AND l.date <= $${parametersArray.length}`
        }
    }

    return {
        teacherIdsQueryString,
        statusQueryString,
        dateQueryString,
        studentsCountQueryString,
        parametersArray
    }
}

type PreparedQueryStringsAndParamsType = {
    teacherIdsQueryString: string
    statusQueryString: string
    dateQueryString: string
    studentsCountQueryString: string
    parametersArray: Array<any>
}

export const dateFormat = 'YYYY-MM-DD'

export const getInsertLessonsValuesString = (lessonsCount: number | undefined, firstDate: string, lastDate: string | undefined, days: number[], title: string): string => {
    // Проверка на взаимоисключающие параметры
    if (lessonsCount !== undefined && lastDate) {
        throw new Error('The lessons Count and lastDate parameters are mutually exclusive');
    }

    const createdLessons: string[] = [];

    const startDate = moment(firstDate, dateFormat);
    let endDate = moment(startDate).add(1, 'year');
    if (lastDate) {
        endDate = moment(lastDate)
    }

    let currentLessonCount = 0;

    function isAllowedDay(day: number): boolean {
        return days.includes(day);
    }

    while ((lessonsCount === undefined || currentLessonCount < lessonsCount) && currentLessonCount < 300 && startDate.isSameOrBefore(endDate)) {
        if (isAllowedDay(startDate.day())) {
            createdLessons.push(`('${title}', '${startDate.format(dateFormat)}')`);

            currentLessonCount++;
        }

        startDate.add(1, 'day');
    }

    return createdLessons.join(', ');
}