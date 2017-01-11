
// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;
Backbone.LocalStorage = require ( './lib/backbone.localStorage.js' );


_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };


var StackModel = Backbone.Model.extend ( {

    defaults: {
        name       : 'New Stack',
        description: 'Simple Stack'
    }

} );


var StackView = Backbone.View.extend ( {

    tagName: 'div',

    className: 'col-sm-4',

    template: _.template ( $('#template-stack').html ( ) ),

    model: StackModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        return this;
    },

    events: {
        'click .panel': 'onClickStack',
        'click span' : 'onClickTrash'
    },

    onClickStack: function ( event ) {
        Backbone.trigger ( 'stack:selected', this.model );
    },

    onClickTrash: function ( event ) {
        this.model.destroy ( );

        event.stopImmediatePropagation ( );
    }

} );


var StackListCollection = Backbone.Collection.extend ( {

    model: StackModel,

    initialize: function ( ) {
        this.localStorage = new Backbone.LocalStorage ( 'StackListCollectionPersist' );
    }

} );


var StackListView = Backbone.View.extend ( {

    el: '#stacklist-container',

    template: _.template ( $('#template-stacklist').html ( ) ),

    initialize: function ( ) {
        this.collection = new StackListCollection ( );
        this.collection.fetch ( );

        this.listenTo ( this.collection, 'remove', this.onCollectionRemove );
    },

    render: function ( ) {
        this.$el.html ( this.template ( {} ) );

        if ( this.collection.size ( ) == 0 ) {
            this.onToggleAdd ( );
        }

        this.collection.each ( function ( item ) {
            var stackView = new StackView ( { model: item } );
            this.$( '#list' ).append ( stackView.render().el );
            item.save ( );
        }, this );

        return this;
    },

    onCollectionRemove: function ( event ) {
        this.render ( );
    },

    events: {
        'click .app-toggle-add': 'onToggleAdd',
        'click .app-add': 'onClickAdd'
    },

    onToggleAdd: function ( ) {
        this.$( '.app-section-addstack' ).toggleClass ( 'hide' );
        this.$( '.app-toggle-add .glyphicon' ).toggleClass ( 'glyphicon-plus glyphicon-remove' );
    },

    onClickAdd: function ( ) {
        var name = this.$( '#name' ).val ( );
        var desc = this.$( '#description' ).val ( );

        var newStack = new StackModel ( {
            name: name,
            description: desc 
        } );

        this.collection.add ( newStack );
        this.render ( );
    },

} );

exports.Model = StackModel;
exports.ListView = StackListView;