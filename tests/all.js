all([
	checkDco
], function( errors ) {
	if ( errors.length ) {
		process.exit( 1 );
	}
});

function all( steps, callback ) {
	var errors = [];

	function next() {
		var step = steps.shift();
		step(function( error ) {
			if ( error ) {
				errors.push( error );
			}

			if ( !steps.length ) {
				return callback( errors );
			}

			next();
		});
	}

	next();
}

function checkDco( callback ) {
	var dco = require( "../index" );

	console.log();
	console.log( "Checking commits for licensing..." );
	dco.getCommitErrors({
		path: ".",
		exceptionalAuthors: {
			"scott.gonzalez@gmail.com": "Scott González"
		}
	}, function( error, errors ) {
		if ( error ) {
			return callback( error );
		}

		if ( errors.length ) {
			console.log( "The following errors exist:" );
			errors.forEach(function( error ) {
				console.log( "- " + error );
			});

			return callback( new Error( "Invalid commits." ) );
		}

		console.log( "All commits have appropriate licensing." );
		callback( null );
	});
}
