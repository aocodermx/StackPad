
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
const Stack = require ( './js/StackList.js' );
const Item  = require ( './js/ItemList.js' );
const Entry = require ( './js/EntryList.js' );


var StackPadView = Backbone.View.extend ( {

    el: 'body',

    template: _.template ( $( '#template-stackpad' ).html ( ) ),

    initialize: function ( options ) {
        this.options = options || {};
        this.options.home = path.join ( os.homedir ( ), 'StackPad' );

        // StackListView component.
        this.stackListView = new Stack.ListView ( );
        Backbone.on ( 'stack:selected', this.onStackSelected );
        Backbone.on ( 'item:selected', this.onItemSelected );

        this.render ( );  
    },

    render: function ( ) {
        this.stackListView.render ( );
        return this;
    },

    onStackSelected: function ( stackname ) {
        console.log ( 'Selected Stack:', stackname, 'A new ItemListView should be created.' );

        this.itemListView = new Item.ListView ( );
        this.itemListView.render ( );
    },

    onItemSelected: function ( itemname ) {
        console.log ( 'Selected Item:', itemname, 'A new EntryListView should be created.');

        this.entryListView = new Entry.ListView ( );
        this.entryListView.render ( );
    }

} );

var StackPadApp = new StackPadView ( );