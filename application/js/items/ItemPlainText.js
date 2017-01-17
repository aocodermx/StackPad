const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;


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

    className: 'row',

    template: _.template ( $( '#template-plain-text' ).html ( ) ),

    model: ItemPlainTextModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        
        return this;
    },
    
    events: {
        'click .app-return'        : 'onReturn',
    },

    onReturn : function ( ) {
        console.log ( "Item close selected" );
        Backbone.trigger ( 'item:closed', this );
        this.model.save ( );
    },

} );

exports.Model = ItemPlainTextModel;
exports.View = ItemPlainTextView;