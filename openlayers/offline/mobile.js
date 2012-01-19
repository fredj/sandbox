// initialize map when page ready
var map, osm, offlinePanel;

# see https://github.com/fredj/openlayers/blob/tile-canvas/lib/OpenLayers/Util.js#L1441
OpenLayers.CANVAS_SUPPORTED = true;

// Get rid of address bar on iphone/ipod
var fixSize = function() {
    window.scrollTo(0,0);
    document.body.style.height = '100%';
    if (!(/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()))) {
        if (document.body.parentNode) {
            document.body.parentNode.style.height = '100%';
        }
    }
};
setTimeout(fixSize, 700);
setTimeout(fixSize, 1500);

var saveGridIntoCache = function(grid) {
    var count = 0, size = 0;
    for (var i = 0, ilen = grid.length; i < ilen; i++) {
        for (var j = 0, jlen = grid[i].length; j < jlen; j++) {
            var tile = grid[i][j];
            var dataUrl = tile.getCanvasContext().canvas.toDataURL();
            localStorage.setItem(tile.url, dataUrl);
            size += dataUrl.length;
            count++;
        }
    }
    return {count: count, size: size};
}

var init = function() {
    osm = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
        tileClass: OpenLayers.Tile.Image
    });
    osm.url = '/osm/${z}/${x}/${y}.png';

    var zoomPanel = new OpenLayers.Control.ZoomPanel();
    zoomPanel.addControls([new OpenLayers.Control.Geolocate({
        type: OpenLayers.Control.TYPE_TOGGLE,
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        },
        eventListeners: {
            locationupdated: function(e) {
            }
        }
    })]);

    offlinePanel = new OpenLayers.Control.Panel({
        displayClass: "offlinePanel",
        autoActivate: true
    });
    offlinePanel.addControls([new OpenLayers.Control({
        type: OpenLayers.Control.TYPE_BUTTON,
        displayClass: "offlineButton",
        trigger: function() {
	    // var minZoom = map.getZoom();
	    var extent = map.getExtent();
            // localStorage.setItem('offline-bbox', extent.toString());
            // localStorage.setItem('offline-resolution', map.getResolution());

            // osm.events.register('tileloaded', osm, function(evt) {
	    //     console.log('tile loaded (which one ?)');
            // });
	    osm.events.register('loadend', osm, function(evt) {
	        //console.log('all tile loaded for zoom ' + this.map.getZoom());
                saveGridIntoCache(this.grid);
	        this.map.zoomIn();
	    });
            saveGridIntoCache(osm.grid);
	    map.zoomIn();
            // FIXME: goto previous position
            // FIXME: remove listeners
        }
    })]);

    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            zoomPanel,
            offlinePanel
        ],
        layers: [osm]
    });

    OpenLayers.Event.observe(document, 'online', handleNetworkChange);
    OpenLayers.Event.observe(document, 'offline', handleNetworkChange);

    // ?offline to force offline mode
    var offline = OpenLayers.Util.getParameters(window.location.href).offline != null;
    handleNetworkChange({
        type: (!offline && navigator.onLine) ? 'online' : 'offline'
    });
    map.setCenter([730540, 5863723], 15);
};

var fetchFromCache = function(func) {
    return function() {
        var ret = func.apply(this, arguments);
        var cached = localStorage.getItem(ret);
        if (cached) {
            console.log('cache hit : ' + ret);
        } else {
            console.log('cache miss: ' + ret);
        }
        return cached || '';
    }
};
var handleNetworkChange = function(evt) {
    if (evt.type == 'online') {
        offlinePanel.div.style.display = '';
    } else {
        offlinePanel.div.style.display = 'none';
        osm.getURL = fetchFromCache(osm.getURL);
        // var resolution = localStorage.getItem('offline-resolution');
        // var extent = localStorage.getItem('offline-bbox');
        // if (extent) {
        //     extent = OpenLayers.Bounds.fromString(extent);
        //     map.maxExtent = extent;
        //     map.restrictedExtent = extent;
        //     map.zoomToMaxExtent();
        // }
        console.log('offline handle done');
    }
}
