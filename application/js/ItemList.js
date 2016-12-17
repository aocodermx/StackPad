// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };


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
        this.$el.toggleClass ( 'active' );
        Backbone.trigger ( 'item:selected', this.model.get ( 'name' ) );
    }

} );

var ItemListCollection = Backbone.Collection.extend ( {

    model: ItemModel

} );

exports.ListView = Backbone.View.extend ( {

    el: '#itemlist-container',

    template: _.template ( $( '#template-itemlist' ).html ( ) ),

    events: {
        'click .add': 'onClickAdd'
    },

    initialize: function ( ) {
        this.collection = new ItemListCollection ( );
    },

    onClickAdd: function ( ) {
        console.log ( 'Add New item' );
        var name = this.$( '#name' ).val ( );

        var newItem = new ItemModel ( {
            name: name
        } );

        this.collection.add ( newItem );
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( { } ) );

        this.collection.each ( function ( item ) {
            var itemView = new ItemView ( { model: item } );
            this.$( '#list' ).append ( itemView.render ( ).el );
        }, this );

        return this;
    }

} );