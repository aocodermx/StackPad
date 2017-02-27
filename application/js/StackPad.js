
// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;


Backbone.LocalStorage = require ( './js/lib/backbone.localStorage.js' );


// Application components
const Item      = require ( './js/Item.js' );
const Container = require ( './js/Container.js' );
const ItemPlainText = require ( './js/items/ItemPlainText.js' );


// const LocalStorage = require("./lib/backbone.localStorage.js");


var StackPadView = Backbone.View.extend ( {

    el: 'body',

    template: _.template ( $('#template-stackpad').html ( ) ),

    initialize: function ( options ) {
        this.options = options || { };
        // this.options.home = path.join ( os.homedir ( ), 'StackPad' );

        var rootItem = new Item.Model ( { name: 'StackPad', parent:'/', type:'container' } );

        this.containers = [];
        this.containers.push ( new Container.View ( { model: rootItem } ) );

        Backbone.on ( 'item:selected', this.onItemSelected, this );
        Backbone.on ( 'item:closed'  , this.onItemClosed  , this );
        Backbone.on ( 'container:closed', this.onContainerClosed, this );
        $ ( window ).on ( 'resize', this.containers, this.onWindowResize );
        
        this.render ( );
    },

    render: function ( ) {
        // TODO: Logic to append containers instead of delete it.
        // this.$el.append ( ... );
        //     Option 1: set an specific id to the bootstrap collapse elements.
        //     Option 2: implement collapse behaviour with backbone events.

        this.$el.html ( this.template ( ) );
        var lastView = _.last ( this.containers );

        if ( typeof lastView !== 'undefined' ) {
            this.$( '#app-container' ).html ( lastView.render ( ).el );
            lastView.adjustArea ( );
        }
        
        return this;
    },

    onItemSelected: function ( item ) {
        var itemView = null;

        console.log ( 'Type selected:', item.get ( 'type' ) );

        if ( item.get( 'type' ) === 0 ) { // Render a container in the left panel
            itemView = new Container.View ( { model : item } );
            this.containers.push ( itemView );
            this.render ( );
        } else { // Render content on the left panel
            itemView = new ItemPlainText.View ( { model:item } );
            this.$( '#app-content' ).html ( itemView.render ( ).el );
            itemView.adjustArea ( );
        }
        
    },

    onItemClosed: function ( itemView ) {
        itemView.remove ( );
        //this.containers.pop ( );
        this.render ( );
    },

    onContainerClosed: function ( containerView ) {
        containerView.remove ( );
        this.containers.pop ( );
        this.render ( );

        // Backbone.on ( 'container:closed', this.onContainerClosed, this );
    },

    onWindowResize: function ( event ) {
        var lastView = _.last ( event.data );

        if ( typeof lastView !== 'undefined' ) {
            lastView.adjustArea ( );
        }
    },

} );

var StackPadApp = new StackPadView ( );