
// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

// Other dependencies
const os   = require ( 'os' );
const path = require ( 'path' );

// Application components
const Stack = require ( './js/Stack.js' );


var StackPadView = Backbone.View.extend ( {

    el: 'body',

    template: _.template ( $( '#template-stackpad' ).html ( ) ),

    initialize: function ( options ) {
        this.options = options || {};
        this.options.home = path.join ( os.homedir ( ), 'StackPad' );

        this.stackListView = new Stack.ListView ( );

        this.render ( );  
    },

    render: function ( ) {
        this.stackListView.render ( );
        return this;
    }

} );

var StackPadApp = new StackPadView ( );