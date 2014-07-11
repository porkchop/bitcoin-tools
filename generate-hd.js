var bitcoin = require( 'bitcoinjs-lib' );
var bitcore = require( 'bitcore' );

if( process.argv.length < 3 )
	console.log( 'Usage: node generate-hd.js <seed string> [<number of keys to generate>]' );
else
{
	var seedBuffer = new Buffer( process.argv[ 2 ] );
	var number = process.argv.length > 3 ? parseInt( process.argv[3] ) : 10;

	function viaBitcoinjs() {
		console.log('Via bitcoinjs-lib...');
		console.log('--------------------');
		console.log();

		var hdWallet = bitcoin.HDNode.fromSeedBuffer( seedBuffer );

		console.log( 'Base58 private key: ' + hdWallet.toBase58( true ) );
		console.log( 'Base58 public key:  ' + hdWallet.toBase58( false ) );
		console.log();

	/*	console.log( '*** First, the "master node" public and private keys.' );
		console.log( 'Private key: ' + hdWallet.priv.toWif() );
		console.log( 'Public Key: ' + hdWallet.pub.toWif() );
		console.log();*/

		console.log( '*** Here are your private keys and their corresponding addresses:' );
		for( var i=1; i<=number; i++ )
		{
			var derivedPrivate = hdWallet.derive( i );
			console.log( 'Key: ' + derivedPrivate.privKey.toWIF() + '   Addr: ' + derivedPrivate.getAddress().toString() );
		}
		console.log();

		var fromPub = bitcoin.HDNode.fromBase58( hdWallet.toBase58( false ) );
		console.log( '*** Now, some derived addresses from the public key only (just to make sure they match):' );
		for( var i=1; i<=number; i++ )
		{
			var derived = fromPub.derive( i );
			console.log( 'Addr: ' + derived.getAddress().toString() );
		}

		console.log();
	}

	function viaBitcore() {
		console.log('Via bitcore...');
		console.log('--------------');
		console.log();

	  var HierarchicalKey = bitcore.HierarchicalKey;
	  var Address = bitcore.Address;

	  var hkey = HierarchicalKey.seed( seedBuffer );

		console.log( 'Base58 private key: ' + hkey.extendedPrivateKeyString());
		console.log( 'Base58 public key:  ' + hkey.extendedPublicKeyString() );
		console.log();

		console.log( '*** Here are your private keys and their corresponding addresses:');
		for( var i=1; i<=number; i++ )
		{
			var derivedPrivate = hkey.derive( 'm/' + i );
			console.log( 'Key: ' + derivedPrivate.eckey.private.toString('hex') + '   Addr: ' + Address.fromPubKey(derivedPrivate.eckey.public));
  	}
		console.log();

	  var fromPub = new HierarchicalKey(hkey.extendedPublicKeyString());
		console.log( '*** Now, some derived addresses from the public key only (just to make sure they match):' );
		for( var i=1; i<=number; i++ )
		{
			var derived = fromPub.derive( 'm/' + i );
			console.log( 'Addr: ' + Address.fromPubKey(derived.eckey.public) );
		}

		console.log();
	}

	viaBitcoinjs();
	viaBitcore();
}
