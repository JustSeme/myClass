import { TeacherViewModel } from "./application/models/TeacherViewModel"

export const prepareParamWithCommaSeparator = (param: string): number[] => {
    const parameterArray = param.split(',')
    if (parameterArray[0] === '') {
        return []
    }
    return parameterArray.map(parameter => Number(parameter))
}

export const prepareTeacherIds = (teacherIds: string) => {
    const teacherIdsArray = teacherIds.split(',')
    return `'${teacherIdsArray.join("', '")}'`
}

export const prepareStudentCountQueryString = (studentsCountInputString: string) => {

}

/* export const filterByStudentsCount = (preparedStudentCount: number[], studentsLength: number): boolean => {
    if (preparedStudentCount.length === 2) {
        if (studentsLength < preparedStudentCount[0] || studentsLength > preparedStudentCount[1]) {
            return false
        }
    } else if (preparedStudentCount.length === 1) {
        if (studentsLength !== preparedStudentCount[0]) {
            return false
        }
    }
    return true
}

export const filterByStatus = (status: number | null, lessonStatus: number): boolean => {
    if (status !== -1) {
        if (lessonStatus !== status) {
            return false
        }
    }
    return true
}

export const filterByTeacherIds = (teacherIds: number[], teachers: TeacherViewModel[]): boolean => {
    if (teacherIds.length) {
        if (!teachers.length) {
            return false
        }
        for (let i = 0; i < teachers.length; i++) {
            if (teacherIds.some(id => id === teachers[i].id)) {
                return true
            } else {
                return false
            }
        }
    }
    return true
} */