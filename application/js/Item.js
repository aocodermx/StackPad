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

    urlRoot: '/item',

    defaults: {
        parent  : '',
        name    : 'item',
        type    : 'container',
        priority: 0,
    },

    initialize: function ( ) {
        this.set ( 'path', this.get ( 'parent' ) + '/' + this.get ( 'name' ) );
    }

} );

var ItemView = Backbone.View.extend ( {

    tagname: 'li',

    className: 'item list-group-item',

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
        'click .app-item-delete'   : 'onItemDelete',
    },

    onItem: function ( ) {
        Backbone.trigger ( 'item:selected', this.model );
    },

    onItemDelete: function ( event ) {
        this.model.destroy ( );
        this.remove ( );
        event.stopPropagation()
    }

} );


var ItemCollection = Backbone.Collection.extend ( { 
    
    model: ItemModel,

    url: '/item',

    comparator: 'type',

    // localStorage : new Backbone.LocalStorage( 'items' ),

    setName : function ( name ) {
        this.localStorage = new Backbone.LocalStorage( name );
    },

    sortStringBy: function ( field, asc ) {
        this.comparator = function ( a, b ) {
            var a = a.get ( field );
            var b = b.get ( field );

            if ( asc ) {
                return a.localeCompare ( b );
            } else {
                return b.localeCompare ( a );
            }
        };
        this.sort ( );
    },

    sortNumberBy: function ( field, asc ) {
        this.comparator = function ( a, b ) {
            var a = a.get ( field );
            var b = b.get ( field );

            if ( asc ) {
                return a > b;
            } else {
                return a < b;
            }
        };
        this.sort ( );
    },

} );

exports.Model = ItemModel;
exports.View  = ItemView;
exports.Collection = ItemCollection;