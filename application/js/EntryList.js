// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;


_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };

// Application components
const Item = require ( './ItemList.js' );


var EntryModel = Backbone.Model.extend ( {

    defaults: {
        title: 'New Entry',
        body: 'Entry Body'
    }

} );

var EntryView = Backbone.View.extend ( {

    tagName: 'div',

    className: '',

    template: _.template ( $( '#template-entry' ).html ( ) ),

    events: {
        '':''
    },

    model: EntryModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        return this;
    }

} );


var EntryListCollection = Backbone.Collection.extend ( {

    model: EntryModel

} );


exports.ListView = Backbone.View.extend ( {

    el: '#entrylist-container',

    template: _.template ( $( '#template-entrylist' ).html ( ) ),

    model: Item.Model,

    initialize: function ( ) {
        this.collection = new EntryListCollection ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );

        this.collection.each ( function ( entry ) {
            var entryView = new EntryView ( { model: entry } );
            this.$( '#list' ).append ( entryView.render ( ).el );
        }, this );

        return this;
    },

    changeItem: function ( model ) {
        this.model.set ( model.toJSON ( ) );
        this.render ( );
    },

    events: {
        'click .app-return': 'onReturn',
        'click .add': 'onClickAdd'
    },

    onReturn: function ( ) {
        Backbone.trigger ( 'item:unselected', this.model.get ( 'name' ) );
    },

    onClickAdd: function ( ) {
        console.log ( 'Add New Entry' );
        
        this.collection.add ( new EntryModel ( ) );
        this.render ( );
    }

} );