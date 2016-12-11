const Backbone = require ( 'backbone' );
const path = require ( 'path' );
const fs   = require ( 'fs' );
const os   = require ( 'os' );

exports.mStackPad = Backbone.Model.extend ( {
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


exports.mStack = Backbone.Model.extend ( {
    defaults: {
        name       : 'New Stack',
        description: 'Simple Stack',
        color      : '#000000',
        iconName   : 'new.svg'
    },
    validate: function ( attributes ) {
        if ( attributes.name === undefined ) {
            return 'stack name required.'
        }

        if ( attributes.description === undefined ) {
            return 'stack description required.';
        }

        // TODO: Check if a valid color is provided.
        if ( attributes.color === undefined ) {
            return 'stack color required';
        }

        // TODO: Check if a valid svg file name provided.
        if ( attributes.iconName === undefined ) {
            return 'stack icon required';
        }
    }
} );

