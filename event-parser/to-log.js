const toLog = (events) => {
    let logs = [];

    events.forEach((event) => {
        if (typeof event === 'string' || typeof event === 'number') {
            logs.push(event);
        } else if (Array.isArray(event.message)) {
            const subLogs = toLog(event.message);
            logs = logs.concat(subLogs.join(''));
        } else if (event.message && event.message.alert) {
            const subLogs = toLog(event.message.alert.message);
            logs = logs.concat(subLogs.join(''));
        } else if (event.players) {
        } else if (typeof event === 'object') {
            logs.push(event.name || event.label);
        }
    });

    return logs;
};

module.exports = toLog;
