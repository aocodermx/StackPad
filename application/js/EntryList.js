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

    model: EntryModel,

    initialize: function ( models, options ) {
        this.localStorage = new Backbone.LocalStorage ( options.item + 'EntryList' );
    }

} );


exports.ListView = Backbone.View.extend ( {

    el: '#entrylist-container',

    template: _.template ( $( '#template-entrylist' ).html ( ) ),

    model: Item.Model,

    initialize: function ( options ) {
        this.options = options || { };
        this.collection = new EntryListCollection ( [], { item: 'default' } );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );

        this.collection.each ( function ( entry ) {
            var entryView = new EntryView ( { model: entry } );
            this.$( '#list' ).append ( entryView.render ( ).el );
            entry.save ( );
        }, this );

        return this;
    },

    changeItem: function ( model ) {
        console.log ( 'Change to Item: ', model.get ( 'name' ) )
        this.model.set ( model.toJSON ( ) );
        this.collection = new EntryListCollection ( [], { item: model.get ( 'name' ) } );
        this.collection.fetch ( );
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