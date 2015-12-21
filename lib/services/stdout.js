module.exports = function() {
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
