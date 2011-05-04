OpenLayers.Control.FullScreen = OpenLayers.Class(OpenLayers.Control, {

    type: OpenLayers.Control.TYPE_TOGGLE,

    activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            OpenLayers.Element.addClass(this.map.div, 'fullscreen_map');
            this.map.updateSize();
        }
    },

    deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            OpenLayers.Element.removeClass(this.map.div, 'fullscreen_map');
            this.map.updateSize();
        }
    },

    CLASS_NAME: "OpenLayers.Control.FullScreen"
});
