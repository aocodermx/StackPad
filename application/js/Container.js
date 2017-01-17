const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;


const Item = require ( './Item.js' );
const ItemPlainText = require ( './items/ItemPlainText.js' );


var ContainerModel = Item.Model.extend ( {

    defaults : _.extend ( { }, Item.Model.prototype.defaults, {
        type  : 'container',
        groups: 1,
    } ),

    initialize : function ( ) {
        ContainerModel.__super__.initialize.apply ( this, arguments );
        this.set ( 'elements', new Item.Collection ( ) );
    }

} );


var ContainerView = Backbone.View.extend ( {

    // el: '#container',

    tagName: 'div',

    className: 'row',

    template: _.template ( $('#template-container-stack').html ( ) ),

    model: ContainerModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );

        if ( this.model.get ( 'parent' ) !== '.' ) {
            console.log ( this.model.get ( 'parent' ), this.model.get ( 'parent' ) !== '.' );
            this.$( '.app-return').removeClass ( 'hide' );
        } else {
            this.$( '.app-return').addClass ( 'hide' );
        }

        this.model.get ( 'elements' ).each ( function ( item, index ) {
            var itemView = new Item.View ( { model: item } );
            this.$( '#items' ).append ( itemView.render( ).el );
        }, this );

        this.delegateEvents( );

        return this;
    },

    events: {
        'click .app-return'        : 'onReturn',
        'click .app-add-item'      : 'onAddItem',
        'click .app-add-container' : 'onAddContainer',
    },

    onReturn : function ( ) {
        console.log ( "Item closed selected" );
        Backbone.trigger ( 'container:closed', this );
    },

    onAddItem : function ( ) {
        var itemName = this.$( '#item-name' ).val ( );
        console.log ( "Add a new Item with name", itemName );

        var itemModel = new Item.Model ( {
            parent: this.model.get( 'path' ),
            name : itemName,
        } );

        this.model.get ( 'elements' ).add ( itemModel );
        this.model.save ( );
        this.render ( );
    },

    onAddContainer: function ( ) {
        var containerName = this.$( '#container-name' ).val ( );
        var containerType = this.$( '#container-type' ).val ( );
        console.log ( "Add a new Container with name", containerName, "of type", containerType );

        var aContainer = new ContainerModel ( {
            parent: this.model.get( 'path' ),
            name : containerName,
            type : containerType,
        } );

        this.model.get ( 'elements' ).add ( aContainer );
        this.model.save ( );
        this.render ( );
    },

} );

exports.Model = ContainerModel;
exports.View  = ContainerView;