// Backbone dependency setup
const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;

const Persistance = require ( './Persistance.js' );
const path = require ( 'path' );

Backbone.sync = Persistance.FileSystem;

/*
 * ItemModel: Base clase for elements to be displayed in a list component.
 */
var ItemModel = Backbone.Model.extend ( {

    urlRoot: '/item',

    defaults: {
        name    : 'a item',
        type    : 1,
        created : 0,
        priority: 0,
        collapse: true,
        basedir : '',
    },

    initialize: function ( ) {
        // this.set ( 'path', this.get ( 'parent' ) + '/' + this.get ( 'name' ) );
    },

    fspath: function ( ) {
        return path.join ( this.get ( 'basedir' ), this.get ( 'name' ) );
    },

    fsfile: function ( ) {
        return path.join ( this.get ( 'basedir' ), this.get ( 'name' ), 'meta.pad' );
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
        'click .app-item-details'  : 'onDetails',
        'click .app-item'          : 'onItem',
        'click .app-item-delete'   : 'onItemDelete',
        'click .app-priority-inc'  : 'onItemPriorityIncrease',
        'click .app-priority-dec'  : 'onItemPriorityDecrease',
    },

    onDetails: function ( event ) {
        this.$( '.item-details' ).collapse ( 'toggle' );
        this.$( '.app-item-details' ).toggleClass ( 'glyphicon-chevron-down' );
        this.$( '.app-item-details' ).toggleClass ( 'glyphicon-chevron-up' );

        event.stopPropagation ( );
    },

    onItem: function ( ) {
        Backbone.trigger ( 'item:selected', this.model );
    },

    onItemDelete: function ( event ) {
        console.log ( 'delete the item ', this.model, this.model.destroy ( ) );
        //this.model.destroy ( );
        this.remove ( );
        event.stopPropagation ( );
    },

    onItemPriorityIncrease: function ( event ) {
        this.model.set ( 'priority', this.model.get ( 'priority' ) + 1 );
        this.model.save ( );
        event.stopPropagation ( );
    },

    onItemPriorityDecrease: function ( event ) {
        this.model.set ( 'priority', this.model.get ( 'priority' ) - 1 );
        this.model.save ( );
        event.stopPropagation ( );
    }

} );


var ItemCollection = Backbone.Collection.extend ( { 
    
    model: ItemModel,

    url: '/item',

    comparator: 'type',

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