const toGameLog = (events) => {
  let logs = [];

  events.forEach((event) => {
    if (typeof event === 'string' || typeof event === 'number') {
      logs.push(event);
    } else if (Array.isArray(event.message)) {
      const subLogs = toGameLog(event.message);
      logs = logs.concat(subLogs.join(''));
    } else if (event.message && event.message.alert) {
      const subLogs = toGameLog(event.message.alert.message);
      logs = logs.concat(subLogs.join(''));
    } else if (event.players) {
      1;
    } else if (typeof event === 'object') {
      logs.push(event.name || event.label);
    }
  });

  return logs;
};

module.exports = toGameLog;
