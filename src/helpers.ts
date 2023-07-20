export const prepareStudentsCountParam = (studentsCount: string): number[] => {
    const studentsCountArray = studentsCount.split(',')
    if (studentsCountArray[0] === '') {
        return []
    }
    return studentsCountArray.map(studentsCount => Number(studentsCount))
}

export const filterByStudentsCount = (preparedStudentCount: number[], studentsLength: number): boolean => {
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