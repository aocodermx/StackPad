// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;
Backbone.LocalStorage = require ( './lib/backbone.localStorage.js' );


_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

// Application components
const Stack = require ( './StackList.js' );


var ItemModel = Backbone.Model.extend ( {

    defaults: {
        name: 'New Item'
    }

} );


var ItemView = Backbone.View.extend ( {

    tagName: 'a',

    className: 'list-group-item',

    attributes: {
        href: '#'
    },

    template: _.template ( $( '#template-item' ).html ( ) ),

    events: {
        'click p': 'onClickItem'
    },

    model: ItemModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        return this;
    },

    onClickItem: function ( event ) {
        Backbone.trigger ( 'item:selected', this.model );
    }

} );


var ItemListCollection = Backbone.Collection.extend ( {

    model: ItemModel,

    initialize: function ( models, options ) {
        this.localStorage = new Backbone.LocalStorage ( options.stack + 'ItemList' );
    }

} );


var ItemListView = Backbone.View.extend ( {

    el: '#itemlist-container',

    template: _.template ( $( '#template-itemlist' ).html ( ) ),

    model: Stack.Model,

    initialize: function ( options ) {
        this.options = options || { };
        this.collection = new ItemListCollection ( [], { stack: 'default' } );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );

        this.collection.each ( function ( item ) {
            var itemView = new ItemView ( { model: item } );
            this.$( '#list' ).append ( itemView.render ( ).el );
            item.save ( );
        }, this );

        return this;
    },

    changeStack: function ( model ) {
        this.model.set ( model.toJSON ( ) );
        this.collection = new ItemListCollection ( [], { stack: model.get ( 'name' ) } );
        this.collection.fetch ( );
        this.render ( );
    },

    events: {
        'click .app-return': 'onReturn',
        'click .app-toggle-add': 'onToggleAdd',
    },

    onReturn: function ( ) {
        Backbone.trigger ( 'stack:unselected', this.model.get ( 'name' ) );
    },

    onToggleAdd: function ( ) {
        this.$( '.app-section-additem' ).toggleClass ( 'hide' );
        this.$( '.app-toggle-add .glyphicon' ).toggleClass ( 'glyphicon-plus glyphicon-remove' );
    },

    onClickAdd: function ( ) {
        var name = this.$( '#name' ).val ( );

        console.log ( 'Add New item', name );

        var newItem = new ItemModel ( {
            name: name
        } );

        this.collection.add ( newItem );
        this.render ( );
    }

} );

exports.ListView = ItemListView;
exports.Model    = ItemModel;