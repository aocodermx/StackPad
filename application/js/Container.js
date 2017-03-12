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
        description: "Stack Items",
        elements: 0
    } ),

    initialize : function ( ) {
        ContainerModel.__super__.initialize.apply ( this, arguments );
    }

} );


var ContainerView = Backbone.View.extend ( {

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

    adjustArea: function ( context ) {
        var containerMaxHeight = window.innerHeight - $("#container .panel-body")[0].getBoundingClientRect().top;

        this.$('#container .panel-body').css ( 'max-height', containerMaxHeight - 1 );
        console.log ( 'adjustArea', containerMaxHeight );
    },

    render: function ( ) {
        this.model.set ( 'elements', this.collection.size ( ) );

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

    onItemDelete: function ( itemView ) {
        console.log ( 'Delete', itemView );
    },

    events: {
        'click .app-toggle-add-item'      : 'onToggleAddItem',
        'click .app-toggle-add-container' : 'onToggleAddContainer',
        'click .app-return'               : 'onReturn',
        'click .app-add-item'             : 'onAddItem',
        'click .app-add-container'        : 'onAddContainer',
        'click .app-sort-byname'          : 'onSortByName',
        'click .app-sort-bytype'          : 'onSortByType',
        'click .app-sort-byelements'      : 'onSortByElements',
        'click .app-sort-bypriority'      : 'onSortByPriority',
        'click .app-sort-bydate'          : 'onSortByDate',
    },

    onToggleAddItem: function ( ) {
        this.$( '.panel-collapse' ).collapse ( 'hide' );
        this.$( '#collapse-new-item' ).collapse ( 'toggle' );
        this.$( '#item-name' ).focus ( );
    },

    onToggleAddContainer: function ( ) {
        this.$( '.panel-collapse' ).collapse ( 'hide' );
        this.$( '#collapse-new-container' ).collapse ( 'toggle' );
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
            created: Date.now()
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
        var containerDesc = this.$( '#container-desc' ).val ( );

        var aContainer = new Item.Model ( {
            parent     : this.model.get( 'path' ),
            name       : containerName,
            description: containerDesc,
            type       : 0,
            groups     : 1,
            elements   : 0,
            created     : Date.now ( )
        } );
        
        this.model.set ( 'elements', this.model.get ( 'elements' ) + 1 );
        this.collection.add ( aContainer );
        aContainer.save ( );
        this.model.save ( );
        this.render ( );
    },

    onSortByName: function ( ) {
        this.collection.sortStringBy ( 'name', this.ascName = !this.ascName || false );
        this.render ( );
    },

    onSortByType: function ( ) {
        this.collection.sortNumberBy ( 'type', this.ascType = !this.ascType || false );
        this.render ( );
    },

    onSortByElements: function ( ) {
        this.collection.sortNumberBy ( 'elements', this.ascElements = !this.ascElements || false );
        this.render ( );
    },

    onSortByPriority: function ( ) {
        this.collection.sortNumberBy ( 'priority', this.ascPriority = !this.ascPriority || false );
        this.render ( );
    },

    onSortByDate: function ( ) {
        this.collection.sortNumberBy ( 'created', this.ascCreated = !this.ascCreated || false );
        this.render ( );
    },

} );

exports.Model = ContainerModel;
exports.View  = ContainerView;