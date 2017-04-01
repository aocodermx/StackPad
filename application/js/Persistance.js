
const os   = require ( 'os' );
const fs   = require ( 'fs' );
const path = require ( 'path' );


var FileSystem = function ( method, model, options ) {

    switch ( method ) {

        case 'create':
            if ( ! fs.existsSync ( model.fspath ( ) ) ) {
                console.log ( 'FSP: create directory', model.fspath ( ) );
                fs.mkdirSync ( model.fspath ( ) );
            }

            model.set ( 'id', Math.random ( ) * 10 );
            
            console.log ( 'FSP: create file ', model.fsfile ( ), ' with ', JSON.stringify ( model.toJSON ( ) ) );
            fs.writeFile ( model.fsfile ( ), JSON.stringify ( model.toJSON ( ), null, 4 ) );

            break;
        
        case 'read':
            if ( !fs.existsSync ( model.fsfile ( ) ) )
                return;

            console.log ( 'FSP: read file', model.fsfile ( ), 'into model' );
            model.set ( JSON.parse ( fs.readFileSync ( model.fsfile ( ) ) ) );

            fs.readdirSync ( model.fspath ( ) ).forEach ( file => {
                fileStats = fs.lstatSync ( path.join ( model.fspath ( ), file ) );

                if ( fileStats.isDirectory ( ) && fs.existsSync ( path.join ( model.fspath ( ), file, 'stack.pad' ) ) ) {
                    console.log ( file, ' is directory and is a container' );

                    var container = new Container.Model ( { } );
                    container.set ( JSON.parse ( fs.readFileSync ( path.join ( model.fspath ( ), file, 'stack.pad' ) ) ) );
                    model.items.add ( container );
                }

                if ( fileStats.isDirectory ( ) && fs.existsSync ( path.join ( model.fspath ( ), file, 'meta.pad' ) ) ) {
                    console.log ( file, ' is directory and is a item' );

                    var item = new ItemPlainText.Model ( { } );

                    item.set ( JSON.parse ( fs.readFileSync ( path.join ( model.fspath ( ), file, 'meta.pad' ) ) ) );
                    model.items.add ( item );
                }
            } );
            break;

        case 'update':
            console.log ( 'update FS:', model.toJSON ( ) );
            fs.writeFile ( model.fsfile ( ), JSON.stringify ( model.toJSON ( ), null, 4 ) );
            break;

        case 'delete':
            console.log ( 'delete FS:', model.toJSON ( ) );
            if ( !fs.existsSync ( model.fsfile ( ) ) )
                return;
            if ( ! fs.existsSync ( path.join ( os.tmpdir ( ), 'sptrash' ) ) )
                fs.mkdirSync ( path.join ( os.tmpdir ( ), 'sptrash' ) );
                
            fs.rename ( model.fspath ( ), path.join ( os.tmpdir ( ), 'sptrash', model.get ( 'name' ) ) );
            break;
        default:
            console.log ( 'default FS:', method, model.toJSON ( ) );
            break;
    }

    if ( options.success ) {
        options.success.call ( model, true, options );
    }
}

exports.FileSystem = FileSystem;