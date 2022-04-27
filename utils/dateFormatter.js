module.exports = {
    getFullTime: date => `${date.getHours()}:${date.getMinutes()}h`,
    getFullDate: date => `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}