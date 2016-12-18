
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
        this.options = options || { };
        this.options.home = path.join ( os.homedir ( ), 'StackPad' );

        // StackListView component.
        this.stackListView = new Stack.ListView ( );
        this.itemListView = new Item.ListView ( { model: new Stack.Model ( ) } );
        this.entryListView = new Entry.ListView ( { model: new Item.Model ( ) } );
        
        Backbone.on ( 'stack:selected', this.onStackSelected, this );
        Backbone.on ( 'stack:unselected', this.onStackUnselected, this );
        Backbone.on ( 'item:selected', this.onItemSelected, this );
        Backbone.on ( 'item:unselected', this.onItemUnselected, this );

        this.render ( );  
    },

    render: function ( ) {
        this.stackListView.render ( );
        this.itemListView.render ( );
        this.entryListView.render ( );

        console.log ( this.itemListView );
        return this;
    },

    onStackSelected: function ( stack ) {
        console.log ( 'Selected Stack:', stack.get ( 'name' ) , 'A new ItemListView should be created.' );
        this.itemListView.changeStack ( stack );

        this.$( '#stacklist-container' ).addClass ( 'hide' );
        this.$( '#itemlist-container' ).removeClass ( 'hide' );
    },

    onStackUnselected: function ( stack ) {
        console.log ( 'Unselected Stack:', stack, 'StacListView should become visible');        

        this.$( '#stacklist-container' ).removeClass ( 'hide' );
        this.$( '#itemlist-container' ).addClass ( 'hide' );
    },

    onItemSelected: function ( item ) {
        console.log ( 'Selected Item:', item, 'A new EntryListView should be created.');
        this.entryListView.changeItem ( item );

        this.$( '#itemlist-container' ).addClass ( 'hide' );
        this.$( '#entrylist-container' ).removeClass ( 'hide' );
    },

    onItemUnselected: function ( item ) {
        console.log ( 'Unselected Item', item, 'ItemListView should become visible' );

        this.$( '#itemlist-container' ).removeClass ( 'hide' );
        this.$( '#entrylist-container' ).addClass ( 'hide' );
    }

} );

var StackPadApp = new StackPadView ( );