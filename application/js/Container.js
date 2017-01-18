const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

Backbone.LocalStorage = require ( './lib/backbone.localStorage.js' );

const Item = require ( './Item.js' );
const ItemPlainText = require ( './items/ItemPlainText.js' );


var ContainerModel = Item.Model.extend ( {

    urlRoot : '/container',

    localStorage: new Backbone.LocalStorage("container"),

    defaults : _.extend ( { }, Item.Model.prototype.defaults, {
        type  : 'container',
        groups: 1,
    } ),

    initialize : function ( ) {
        ContainerModel.__super__.initialize.apply ( this, arguments );
    }

} );


var ContainerView = Backbone.View.extend ( {

    // el: '#container',

    tagName: 'div',

    className: 'row',

    template: _.template ( $('#template-container-stack').html ( ) ),

    model: Item.Model,

    initialize: function ( options ) {
        this.options = options || { };

        this.collection = new Item.Collection ( ),
        this.collection.setName ( this.model.get ( 'name' ) );
        this.collection.fetch ( );
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

        console.log ( this.collection );

        if ( this.collection.length != 0 ) {

            this.collection.each ( function ( item, index ) {
                var itemView = new Item.View ( { model: item } );
                this.$( '#items' ).append ( itemView.render( ).el );
            }, this );
        }

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
        var itemType = this.$( '#item-type' ).val ( );
        console.log ( "Add a new Item with name", itemName, itemType );

        var itemModel = new ItemPlainText.Model ( {
            parent: this.model.get( 'path' ),
            name : itemName,
            type: itemType,
        } );

        this.collection.add ( itemModel );
        itemModel.save ( );
        this.render ( );
    },

    onAddContainer: function ( ) {
        var containerName = this.$( '#container-name' ).val ( );
        var containerType = this.$( '#container-type' ).val ( );
        console.log ( "Add a new Container with name", containerName, "of type", containerType );

        var aContainer = new Item.Model ( {
            parent: this.model.get( 'path' ),
            name : containerName,
            type : 'container',
        } );

        this.collection.add ( aContainer );
        aContainer.save ( );
        this.render ( );
    },

} );

exports.Model = ContainerModel;
exports.View  = ContainerView;