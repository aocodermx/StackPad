// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

Backbone.LocalStorage = require ( './lib/backbone.localStorage.js' );

// _.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };


/*
 * ItemModel: Base clase for elements to be displayed in a list component.
 */
var ItemModel = Backbone.Model.extend ( {

    defaults: {
        parent: '',
        name: 'StackPad',
    },

    initialize: function ( ) {
        this.set ( 'path', this.get ( 'parent' ) + '/' + this.get ( 'name' ) );
    }

} );

var ItemView = Backbone.View.extend ( {

    tagname: 'div',

    className: 'item col-sm-3',

    template: _.template ( $( '#template-item' ).html ( ) ),

    model: ItemModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        return this;
    },

    events: {
        'click .app-item'          : 'onItem',
    },

    onItem: function ( ) {
        console.log ( "Item selected", this.model.get( 'name' ) );
        Backbone.trigger ( 'item:selected', this.model );
    }

} );


var ItemCollection = Backbone.Collection.extend ( { 
    
    model: ItemModel,

    localStorage: new Backbone.LocalStorage('items'),

} );

exports.Model = ItemModel;
exports.View  = ItemView;
exports.Collection = ItemCollection;