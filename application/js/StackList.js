
// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };


var StackModel = Backbone.Model.extend ( {

    defaults: {
        name       : 'New Stack',
        description: 'Simple Stack'
    }

} );


var StackView = Backbone.View.extend ( {

    tagName: 'a',

    className: 'list-group-item',

    attributes: {
        href: '#'
    },

    template: _.template ( $('#template-stack').html ( ) ),

    events: {
        'click h4': 'onClickStack',
        'click p' : 'onClickStack'
    },

    model: StackModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        return this;
    },

    onClickStack: function ( event ) {
        this.$el.toggleClass ( 'active' );
        Backbone.trigger ( 'stack:selected', this.model.get ( 'name' ) );
    }

} );

var StackListCollection = Backbone.Collection.extend ( {

    model: StackModel

} );

exports.ListView = Backbone.View.extend ( {

    el: '#stacklist-container',

    template: _.template ( $('#template-stacklist').html ( ) ),

    events: {
        'click .add': 'onClickAdd'
    },

    initialize: function ( ) {
        this.collection = new StackListCollection ( );
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

    render: function ( ) {
        this.$el.html ( this.template ( {} ) );

        this.collection.each ( function ( item ) {
            var stackView = new StackView ( { model: item } );
            this.$( '#list' ).append ( stackView.render().el );
        }, this );

        return this;
    }

} );