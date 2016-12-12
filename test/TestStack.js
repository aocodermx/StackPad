const fs     = require ( 'fs' );
const os     = require ( 'os' );
const path   = require ( 'path' );
const chai   = require ( 'chai' );
const expect = chai.expect;
const assert = chai.assert;

chai.use ( require ( 'chai-fs' ) );


const stack = require ( '../application/js/Stack.js' );

describe ( 'Component -> Stack', function ( ) {
    var aStack;

    before ( function ( ) {
        aStack = new stack.mStack ( );
    } );

    it ( 'Has default values', function ( ) {
        assert.strictEqual ( aStack.get ( 'name' ), 'New Stack' );
        assert.strictEqual ( aStack.get ( 'description' ), 'Simple Stack' );
        assert.strictEqual ( aStack.get ( 'color' ), '#000000' );
        assert.strictEqual ( aStack.get ( 'iconName'), 'new.svg' );
    } );
} );