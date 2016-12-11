const fs     = require ( 'fs' );
const os     = require ( 'os' );
const path   = require ( 'path' );
const chai   = require ( 'chai' );
const expect = chai.expect;
const assert = chai.assert;

chai.use ( require ( 'chai-fs' ) );


const appModels = require ( '../application/js/Models.js' );

describe ( 'Component -> StackPad', function ( ) {
    var stackPad;

    before ( function ( ) {
        stackPad = new appModels.mStackPad ( );
    } );

    after ( function ( ) {
        fs.rename ( stackPad.get ( 'home' ), path.join ( os.tmpdir ( ), 'StackPad' + Math.random () ) );
    } );

    it ( 'Has default values', function ( ) {
        assert.strictEqual ( stackPad.get( 'home' ), path.join ( os.homedir ( ), 'StackPad' ) );
    } );

    it ( 'Home directory created', function ( ) {
        assert.isDirectory ( stackPad.get ( 'home' ), 'home should be a directory' );
    } );
} );


describe ( 'Component -> Stack', function ( ) {
    var stack;

    before ( function ( ) {
        stack = new appModels.mStack ( );
    } );

    it ( 'Has default values', function ( ) {
        assert.strictEqual ( stack.get ( 'name' ), 'New Stack' );
        assert.strictEqual ( stack.get ( 'description' ), 'Simple Stack' );
        assert.strictEqual ( stack.get ( 'color' ), '#000000' );
        assert.strictEqual ( stack.get ( 'iconName'), 'new.svg' );
    } );
} );