let nodeSchedule = require( 'node-schedule' );

const ExactPattern = require( './parser/ExactPattern' );

//////////////
//	Tokens 	//
//////////////
const timeToken = require( './parser/tokens/time' );
const dayToken = require( './parser/tokens/dayOfWeek' );
const tokens = [
	timeToken,
	dayToken
];
const tokenMap = {};

tokens.forEach( t => tokenMap[ t.type ] = t );


////////////////
//  PATTERNS  //
////////////////
let exactPatterns = {};
const createExactPattern = ( ...tokens ) => {
	let pattern = new ExactPattern( ...tokens );
	exactPatterns[ pattern.patternKey ] = pattern;
	return pattern;
};

createExactPattern( timeToken );
createExactPattern( timeToken, dayToken );
createExactPattern( dayToken, timeToken );


function tokenize( string ) {
	let pieces = [ string ];
	let finalPieces = [];

	tokens.forEach( t => {
		finalPieces = [];
		pieces.forEach( p => {
			let parts = extractTokens( t, p );
			parts.forEach( x => finalPieces.push( x ) );
		});
		pieces = finalPieces;
	});

	// Filter out any undefined pieces (still strings)
	finalPieces = finalPieces.filter( p => typeof p !== 'string' );

	return finalPieces;
}

// Go through list and extract pieces from any strings
function extractTokens( tokenType, ...pieces ) {

	// Grab matching strings
	let matchFound = false;
	pieces = pieces.map( piece => {

		let { regex } = tokenType;

		if ( typeof piece === 'string' && regex.test( piece ) ) {
			matchFound = true;
			let [ match ] = regex.exec( piece );

			let matchReg = new RegExp( `(${ match })` );
			let newPieces = piece.split( matchReg ).filter( x => !!x );

			let matchHandled = false;
			newPieces = newPieces.map( n => {
				if ( !matchHandled && tokenType.regex.test( n ) ) {
					matchHandled = true;
					return { type: tokenType.type, val: n, tokenType };
				}
				return n.trim();
			});

			return newPieces;

		} else {

			return piece;
		}

	});
	// flatten
	let flattened = [];
	pieces.forEach( p => {
		if ( Array.isArray( p ) ) {
			p.forEach( x => flattened.push( x ) );
		} else {
			flattened.push( p );
		}
	});
	pieces = flattened;

	if ( matchFound ) {
		return extractTokens( tokenType, ...pieces );
	}

	return pieces;

}

// Parse to time object
function parse( timeString ) {
	let tokens = tokenize( timeString );
	let patternKey = ExactPattern.getPatternKey( tokens );
	if ( exactPatterns[ patternKey ] ) {
		let pattern = exactPatterns[ patternKey ];
		let time = pattern.getTime( tokens );
		return time;
	}
	let err = {
		message: `Unrecognized pattern '${ patternKey }' generated from string '${ timeString }'`,
		string: timeString,
		tokens: tokens
	};
	throw err;
}

// Schedule function
function schedule( time, callback ) {

	let timeObject;
	if ( time instanceof Date || time instanceof Object ) {
		timeObject = time;
	} else {
		timeObject = parse( time );
	}

	return nodeSchedule.scheduleJob( timeObject, () => callback() );
}

module.exports = {
	parse, schedule
};
