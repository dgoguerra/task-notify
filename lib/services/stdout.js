module.exports = function(config) {
    return {
        textNotification: function(title, content) {
            console.log('textNotification', {
                title: title, content: content
            });
        },
        fileNotification: function(title, filepath) {
            console.log('fileNotification', {
                title: title, filepath: filepath
            });
        }
    };
};

module.exports.description = 'Print to stdout.';
