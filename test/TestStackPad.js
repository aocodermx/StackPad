const fs     = require ( 'fs' );
const os     = require ( 'os' );
const path   = require ( 'path' );
const chai   = require ( 'chai' );
const expect = chai.expect;
const assert = chai.assert;

chai.use ( require ( 'chai-fs' ) );

const stackPad = require ( '../application/js/StackPad.js' );

describe ( 'StackPad -> Model', function ( ) {
    var modelStackPad;

    before ( function ( ) {
        modelStackPad = new stackPad.mStackPad ( );
    } );

    after ( function ( ) {
        fs.rename ( modelStackPad.get ( 'home' ), path.join ( os.tmpdir ( ), 'StackPad' + Math.random () ) );
    } );

    it ( 'Has default values', function ( ) {
        assert.strictEqual ( modelStackPad.get( 'home' ), path.join ( os.homedir ( ), 'StackPad' ) );
    } );

    it ( 'Home directory created', function ( ) {
        assert.isDirectory ( modelStackPad.get ( 'home' ), 'home should be a directory' );
    } );
} );

describe ( 'StackPad -> View', function ( ) {
    var viewStackPad;

    before ( function ( ) {
        viewStackPad = new stackPad.vStackPad ( );
    } );

    it ( 'Should be defined', function ( ) {
        assert.isDefined ( viewStackPad );
    } );
} );
