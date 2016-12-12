const Backbone = require ( 'backbone' );
const _    = require ( 'underscore' );
const $    = require ( 'jquery' );
Backbone.$ = $;


const path = require ( 'path' );
const fs   = require ( 'fs' );
const os   = require ( 'os' );


_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };


var StackPadModel = Backbone.Model.extend ( {

    defaults: {
        home: path.join ( os.homedir ( ), 'StackPad' )
    },

    initialize: function ( ) {
        fs.mkdir ( this.get ( 'home' ), function ( error ) {
            if ( error !== null ) {
                console.log ( 'error creating home directory. ', error.message );
            }
        } );
    },

    validate: function ( attributes ) {
        if ( attributes.home === undefined) {
            return 'home directory is missing.';
        }
    },

} );


var StackPadView = Backbone.View.extend ( {

    el: 'body',

    model: new StackPadModel ( ),

    template: _.template ( $( '#template-stackpad' ).html ( ) ),

    initialize: function ( options ) {
        this.options = options || {};
        this.render ( );
    },

    render: function ( ) {
        this.$el.html ( this.template ( this.model.attributes ) );
        return this;
    },

    events: {
        'click #new-stack': 'onClickNewStack'
    },

    onClickNewStack: function ( ) {
        console.log ( 'New stack should be created.' );
    }

} );

var StackPadApp = new StackPadView ( );