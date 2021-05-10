const config = require('config');

class ConfigService {
    getValue(key) {
        return config[key];
    }

    getValueForSection(section, key) {
        return config[section][key];
    }
}

module.exports = ConfigService;
