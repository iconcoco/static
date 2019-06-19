
let mime = {
    ".html":"text/html",
    ".css":"text/css",
    ".gif":"image/gif",
    ".jpeg":"image/jpeg",
    ".jpg":"image/jpeg",
    ".txt":"text/plain",
};

module.exports = function(type){
    if(!mime[type]) return 'text/plain';
    return mime[type];
};  