const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

const Persistance = require ( './Persistance.js' );

Backbone.sync = Persistance.FileSystem;
const path = require ( 'path' );

const Item = require ( './Item.js' );
const ItemPlainText = require ( './items/ItemPlainText.js' );


var ContainerModel = Item.Model.extend ( {

    defaults    : _.extend ( { }, Item.Model.prototype.defaults, {
        type    : 0,
        groups  : 1,
        description: 'Stack Items',
        elements: 0,
    } ),

    initialize : function ( ) {
        ContainerModel.__super__.initialize.apply ( this, arguments );
        this.items = new Item.Collection ( );
    },

    fsfile: function ( ) {
        return path.join ( this.get ( 'basedir' ), this.get ( 'name' ), 'stack.pad' );
    },

} );


var ContainerView = Backbone.View.extend ( {

    tagName: 'div',

    className: 'row',

    template: _.template ( $('#template-container-stack').html ( ) ),

    model: ContainerModel,

    initialize: function ( options ) {
        this.options = options || { };

        //this.collection = new Item.Collection ( ),
        // Fix this
        // this.collection.fetch ( );

        this.render ( );
    },

    adjustArea: function ( context ) {
        var containerMaxHeight = window.innerHeight - $("#container .panel-body")[0].getBoundingClientRect().top;

        this.$('#container .panel-body').css ( 'max-height', containerMaxHeight - 1 );
    },

    render: function ( ) {
        // this.model.set ( 'elements', this.model.items.size ( ) );

        this.$el.html ( this.template ( this.model.attributes ) );

        if ( this.model.get ( 'parent' ) !== '.' ) {
            this.$( '.app-return').removeClass ( 'hide' );
        } else {
            this.$( '.app-return').addClass ( 'hide' );
        }
        
        if ( this.model.items.size ( ) != 0 ) {
            this.model.items.each ( function ( item, index ) {
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
            name : itemName,
            type: itemType,
            created: Date.now(),
            basedir: this.model.fspath ( ),
        } );

        this.model.items.add ( itemModel );
        itemModel.save ( );
        this.model.save ( );
        this.render ( );
    },

    onAddContainer: function ( ) {
        var containerName = this.$( '#container-name' ).val ( );
        var containerType = this.$( '#container-type' ).val ( );
        var containerDesc = this.$( '#container-desc' ).val ( );

        var aContainer = new ContainerModel ( {
            parent     : this.model.get( 'path' ),
            name       : containerName,
            description: containerDesc,
            type       : 0,
            groups     : 1,
            elements   : 0,
            created     : Date.now ( ),
            basedir: this.model.fspath ( ),
        } );
        
        this.model.items.add ( aContainer );
        aContainer.save ( );
        this.model.save ( );
        this.render ( );
    },

    onSortByName: function ( ) {
        this.model.items.sortStringBy ( 'name', this.ascName = !this.ascName || false );
        this.render ( );
    },

    onSortByType: function ( ) {
        this.model.items.sortNumberBy ( 'type', this.ascType = !this.ascType || false );
        this.render ( );
    },

    onSortByElements: function ( ) {
        this.model.items.sortNumberBy ( 'elements', this.ascElements = !this.ascElements || false );
        this.render ( );
    },

    onSortByPriority: function ( ) {
        this.model.items.sortNumberBy ( 'priority', this.ascPriority = !this.ascPriority || false );
        this.render ( );
    },

    onSortByDate: function ( ) {
        this.model.items.sortNumberBy ( 'created', this.ascCreated = !this.ascCreated || false );
        this.render ( );
    },

} );

exports.Model = ContainerModel;
exports.View  = ContainerView;