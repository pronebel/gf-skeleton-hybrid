var _ = require('lodash'),
    fs = require('fs');

function wrapper(data) {
    return {
        "data": data,
        "msg": ""
    };
}

function renderFsMock(path) {
    return JSON.parse(fs.readFileSync('./gulp/mock'+'/data/' + path, 'utf8'));
}

module.exports = {
    'GET /sms-vcode/fetch': wrapper({}),
    'GET /mock/test-req': function(req) {
        return wrapper(req.url);
    },
    'GET /mock/test': renderFsMock('test.json')
}
