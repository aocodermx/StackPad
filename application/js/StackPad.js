
// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;


// Application components
const Item      = require ( './js/Item.js' );
const Container = require ( './js/Container.js' );
const ItemPlainText = require ( './js/items/ItemPlainText.js' );

var id_counter = 1;
Backbone.sync = function(method, model) {
  console.log("I've been passed " + method + " with " + JSON.stringify(model));
  if(method === 'create'){ model.set('id', id_counter++); }
};

var StackPadView = Backbone.View.extend ( {

    el: 'body',

    template: _.template ( "" ),

    initialize: function ( options ) {
        this.options = options || { };
        // this.options.home = path.join ( os.homedir ( ), 'StackPad' );

        this.containers = [];
        this.containers.push ( new Container.View ( { model: new Container.Model ( ) } ) );

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
        console.log ( item.get ( 'name' ), "will open", item, item.get( 'type' ) );

        if ( item.get( 'type' ) === 'container' ) {
            itemView = new Container.View ( {model : item } );
        } else {
            itemModel = new ItemPlainText.Model ( item.attributes );
            itemView = new ItemPlainText.View ( { model:itemModel } );
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