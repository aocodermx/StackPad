const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;


//_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };


const Item = require ( '../Item.js' );

var ItemPlainTextModel = Item.Model.extend ( {

    defaults: _.extend ( { }, Item.Model.prototype.defaults, {
        content : "Plain Text...",
    } ),

    initialize: function ( ) {
        ItemPlainTextModel.__super__.initialize.apply ( this, arguments );
    }
} );


var ItemPlainTextView = Backbone.View.extend ( {

    tagName: 'div',

    className: 'plain-text-view',

    template: _.template ( $( '#template-plain-text' ).html ( ) ),

    model: ItemPlainTextModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        
        return this;
    }

} );

exports.Model = ItemPlainTextModel;
exports.View = ItemPlainTextView;