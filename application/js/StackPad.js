
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

    template: _.template ( "" ),

    initialize: function ( options ) {
        this.options = options || { };
        // this.options.home = path.join ( os.homedir ( ), 'StackPad' );

        var rootItem = new Item.Model ( { name: 'StackPad', parent:'/', type:'container' } );

        this.containers = [];
        this.containers.push ( new Container.View ( { model: rootItem } ) );

        Backbone.on ( 'item:selected', this.onItemSelected, this );
        Backbone.on ( 'item:closed'  , this.onItemClosed  , this );
        Backbone.on ( 'container:closed', this.onContainerClosed, this );
        
        this.render ( );
    },

    render: function ( ) {
        // TODO: Logic to append containers instead of delete it.
        // this.$el.append ( ... );
        //     Option 1: set an specific id to the bootstrap collapse elements.
        //     Option 2: implement collapse behaivour with backbone events.
        var lastView = _.last ( this.containers );

        if ( typeof lastView !== 'undefined' ) {
            this.$el.html ( lastView.render ( ).el );
        }
        
        return this;
    },

    onItemSelected: function ( item ) {
        var itemView = null;

        if ( item.get( 'type' ) === 'container' ) {
            console.log ( 'container' );
            itemView = new Container.View ( { model : item } );
        } else {
            console.log ( 'item' );
            // itemModel = new ItemPlainText.Model ( item.attributes );
            itemView = new ItemPlainText.View ( { model:item } );
        }

        this.containers.push ( itemView );
        this.render ( );
    },

    onItemClosed: function ( itemView ) {
        console.log ( "Render parent view" );
        itemView.remove ( );
        this.containers.pop ( );
        this.render ( );
    },

    onContainerClosed: function ( containerView ) {
        console.log ( "Render parent view" );
        containerView.remove ( );
        this.containers.pop ( );
        this.render ( );

        // Backbone.on ( 'container:closed', this.onContainerClosed, this );
    },

} );

var StackPadApp = new StackPadView ( );