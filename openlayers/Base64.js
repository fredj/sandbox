//
// see http://jsperf.com/encoding-xhr-image-data/12
//
function getTileDataURL(tile, callback, scope) {
    var context = tile.getCanvasContext();
    if (context) {
        var dataURL = context.canvas.toDataURL();
        if (dataURL.substr(0, 11) == 'data:image/') {
            console.log('native');
            callback.call(scope, dataURL);
        } else {
            // probably on Android 2.x
            var xhr = new XMLHttpRequest();
            xhr.open('GET', tile.url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                if (this.status === 200) {
                    var bytes = Array.prototype.slice.call(new Uint8Array(this.response));
                    var base64 = btoa(String.fromCharCode.apply(null, bytes));
                    var mime = 'image/' + (base64.substr(0, 11) == 'iVBORw0KGgo' ? 'png' : 'jpeg');
                    // jpeg = base64.substr(0, 3) == '/9g'
                    callback.call(scope, 'data:' + mime + ';base64,' + base64);
                }
            };
            xhr.send();
        }
    }
}
