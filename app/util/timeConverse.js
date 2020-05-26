class TimeConverse {
    constructor() {}

    // 时间戳转换为日期格式
    static timestampToDate(timestamp) {
        timestamp = new Date(timestamp);
        return `${timestamp.getFullYear()}-${
            timestamp.getMonth() + 1
        }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}:${timestamp.getSeconds()}`;
    }

    //2016-08-15T16:00:00.000Z格式转换为 hh:mm:ss
    static utcToLocal(time) {
        time = new Date(time).getTime();
        time = TimeConverse.timestampToDate(time);
        return time;
    }
}

module.exports = TimeConverse;
