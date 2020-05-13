class TimeConverse {
    constructor() {}

    // 时间戳转换为日期格式
    static timestampToDate(timestamp) {
        timestamp = new Date(timestamp);
        return `${timestamp.getFullYear()}-${
            timestamp.getMonth() + 1
        }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    }
}

module.exports = TimeConverse;
