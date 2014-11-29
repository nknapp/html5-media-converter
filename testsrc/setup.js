var path = require('path');

var baseDir = path.resolve(__dirname, "../tmp");
require("q").longStackSupport = true;
var qfs = require("q-io/fs");

/**
 * Setup a directory (ensure existance, remove any contents
 * @param dirname directory to setup
 * @returns {Promise} a promise on the created directory
 */
function setup(dirname) {
    var directory = path.join(baseDir, dirname);
    return qfs.exists(directory).then(function (exists) {
        if (exists) {
            return qfs.removeTree(directory);
        } else {
            return true;
        }
    }).then(function () {
        return qfs.makeTree(directory);
    }).then(function () {
        return directory;
    });
}

module.exports = setup;