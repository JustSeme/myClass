export const prepareStudentsCount = (param: string): number[] => {
    const parameterArray = param.split(',')
    if (parameterArray[0] === '') {
        return []
    }
    return parameterArray.map(parameter => Number(parameter))
}

export const prepareTeacherIds = (teacherIds: string): string | null => {
    const teacherIdsArray = teacherIds.split(',')
    if (!teacherIdsArray[0]) {
        return null
    }

    const resultedStr = `'${teacherIdsArray.join("', '")}'`

    return resultedStr
}

export const prepareDate = (date: string): string[] => {
    const datesArray = date.split(',')
    if (!datesArray[0]) {
        return []
    }

    return datesArray
}