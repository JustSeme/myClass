export const prepareStudentsCountParam = (studentsCount: string) => {
    const studentsCountArray = studentsCount.split(',')
    if (studentsCountArray[0] === '') {
        return []
    }
    return studentsCountArray.map(studentsCount => Number(studentsCount))
}