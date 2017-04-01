
// Backbone and application dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

const os       = require ( 'os');

// Application components
const Item          = require ( './js/Item.js' );
const Container     = require ( './js/Container.js' );
const ItemPlainText = require ( './js/items/ItemPlainText.js' );
const Persistance   = require ( './js/Persistance.js' );


var StackPadView = Backbone.View.extend ( {

    el: 'body',

    template: _.template ( $('#template-stackpad').html ( ) ),

    initialize: function ( options ) {
        this.options = options || { };

        var rootItem = new Container.Model ( { 
            name       : 'StackPad', 
            description: 'Stack Items',
            type       : 0, 
            basedir    : os.homedir ( ),
        } );

        rootItem.fetch ( );

        if ( rootItem.isNew ( ) ) {
            rootItem.save ( );
        }

        this.containers = [];
        this.containers.push ( new Container.View ( { model: rootItem } ) );

        Backbone.on ( 'item:selected'   , this.onItemSelected   , this );
        Backbone.on ( 'item:closed'     , this.onItemClosed     , this );
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
        this.render ( );
    },

    onContainerClosed: function ( containerView ) {
        containerView.remove ( );
        this.containers.pop ( );
        this.render ( );
    },

    onWindowResize: function ( event ) {
        var lastView = _.last ( event.data );

        if ( typeof lastView !== 'undefined' ) {
            lastView.adjustArea ( );
        }
    },

} );

var StackPadApp = new StackPadView ( );