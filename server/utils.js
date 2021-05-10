const logger = require('../shared/log');

const bind = (app, method, url, callback) => {
    app[method](url, async (req, res) => {
        try {
            await callback(req, res);
        } catch (e) {
            logger.error(e);
            res.status(500).send('An unexpected error occurred');
        }
    });
};

module.exports = {
    bind
};
