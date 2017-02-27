const Backbone = require ( 'backbone' );
const _        = require ( 'underscore' );
const $        = require ( 'jquery' );
Backbone.$     = $;


Backbone.LocalStorage = require ( '../lib/backbone.localStorage.js' );


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

    className: 'container-fluid',

    template: _.template ( $( '#template-plain-text' ).html ( ) ),

    model: ItemPlainTextModel,

    initialize: function ( options ) {
        this.options = options || { };
        this.render ( );
    },

    adjustArea: function ( ) {
        var textAreaRows   = 1;

        this.$('.app-plain-text').attr ( 'rows', textAreaRows );
        
        var textAreaBottom = this.$( '.app-plain-text' )[0].getBoundingClientRect ( ).bottom;
        var textAreaHeight = this.$( '.app-plain-text' )[0].getBoundingClientRect ( ).height;

        while ( textAreaBottom < window.innerHeight - textAreaHeight ) {
            textAreaRows += 1;
            this.$('.app-plain-text').attr ( 'rows', textAreaRows );
            textAreaBottom = this.$( '.app-plain-text' )[0].getBoundingClientRect ( ).bottom;
        }
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        return this;
    },
    
    events: {
        'click .app-return' : 'onReturn' ,
        'click .app-save'   : 'onSave'   ,
        'click .app-cut'    : 'onCut'    ,
        'click .app-copy'   : 'onCopy'   ,
        'click .app-paste'  : 'onPaste'  ,
        'click .app-undo'   : 'onUndo'   ,
        'click .app-redo'   : 'onRedo'   ,
        'click .app-zoomin' : 'onZoomIn' ,
        'click .app-zoomout': 'onZoomOut',
    },

    onReturn : function ( ) {
        console.log ( "Item close selected" );
        this.model.save ( {
            'content' : this.$( '.form-control' ).val ( ),
        } );
        Backbone.trigger ( 'item:closed', this );
    },

    onSave: function ( ) {
        console.log ( this.$( '.form-control' ).val ( ) );
        this.model.save ( {
            'content' : this.$( '.form-control' ).val ( ),
        } );
    },

    onCut: function ( ) {
        this.$( '.app-plain-text' ).focus ( );
        document.execCommand ( 'cut' );
    },

    onCopy: function ( ) {
        this.$( '.app-plain-text' ).focus ( );
        document.execCommand ( 'copy' );
    },

    onPaste: function ( ) {
        this.$( '.app-plain-text' ).focus ( );
        document.execCommand ( 'paste' );
    },

    onUndo: function ( ) {
        this.$( '.app-plain-text' ).focus ( );
        document.execCommand ( 'undo' );
    },

    onRedo: function ( ) {
        this.$( '.app-plain-text' ).focus ( );
        document.execCommand ( 'redo' );
    },

    onZoomIn: function ( ) {
        var size = parseInt ( this.$( '.app-plain-text' ).css ( 'font-size' ).split ( 'px' )[0] );
        this.$( '.app-plain-text' ).css ( 'font-size', size + 2 + "px" );
        this.adjustArea ( );
    },

    onZoomOut: function ( ) {
        var size = parseInt ( this.$( '.app-plain-text' ).css ( 'font-size' ).split ( 'px' )[0] );
        if ( size > 8 )
            this.$( '.app-plain-text' ).css ( 'font-size', size - 2 + "px" );
        this.adjustArea ( );
    },

} );

exports.Model = ItemPlainTextModel;
exports.View = ItemPlainTextView;