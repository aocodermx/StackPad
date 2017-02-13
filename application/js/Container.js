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

    defaults    : _.extend ( { }, Item.Model.prototype.defaults, {
        type    : 'container',
        groups  : 1,
        elements: 0
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
            this.$( '.app-return').removeClass ( 'hide' );
        } else {
            this.$( '.app-return').addClass ( 'hide' );
        }
        
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
        'click .app-toggle-add-item'      : 'onToggleAddItem',
        'click .app-toggle-add-container' : 'onToggleAddContainer',
        'click .app-return'             : 'onReturn',
        'click .app-add-item'           : 'onAddItem',
        'click .app-add-container'      : 'onAddContainer',
    },

    onToggleAddItem: function ( ) {
        this.$( '#item-name' ).focus ( );
    },

    onToggleAddContainer: function ( ) {
        this.$( '#container-name' ).focus ( );
    },

    onReturn : function ( ) {
        Backbone.trigger ( 'container:closed', this );
    },

    onAddItem : function ( ) {
        var itemName = this.$( '#item-name' ).val ( );
        var itemType = this.$( '#item-type' ).val ( );

        var itemModel = new ItemPlainText.Model ( {
            parent: this.model.get( 'path' ),
            name : itemName,
            type: itemType,
        } );

        this.model.set ( 'elements', this.model.get ( 'elements' ) + 1 );
        this.collection.add ( itemModel );
        itemModel.save ( );
        this.model.save ( );
        this.render ( );
    },

    onAddContainer: function ( ) {
        var containerName = this.$( '#container-name' ).val ( );
        var containerType = this.$( '#container-type' ).val ( );

        var aContainer = new Item.Model ( {
            parent: this.model.get( 'path' ),
            name  : containerName,
            type  : 0,
            groups: 1,
            elements: 0,
        } );
        
        this.model.set ( 'elements', this.model.get ( 'elements' ) + 1 );
        this.collection.add ( aContainer );
        aContainer.save ( );
        this.model.save ( );
        this.render ( );
    },

} );

exports.Model = ContainerModel;
exports.View  = ContainerView;