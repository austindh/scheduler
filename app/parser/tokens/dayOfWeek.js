const Token = require( '../Token' );

let days = 'sunday monday tuesday wednesday thursday friday saturday'.split( ' ' );
let daysShort = days.map( d => d.slice( 0, 3 ) );

const getDaysRegex = () => {
	let daysOptions = [];
	days.forEach( day => {
		let abbr = day.slice( 0, 3 );
		daysOptions.push( day, abbr );
	});
	daysOptions = daysOptions.map( o => `(${ o })` );

	let reg = new RegExp( daysOptions.join( '|' ), 'i' );
	return reg;
};

let dayOfWeek = new Token( 'day', getDaysRegex() );

dayOfWeek.extractFunction = regexExec => {
	let [ day ] = regexExec;
	day = day.slice( 0, 3 ).toLowerCase();
	return { dayOfWeek: daysShort.indexOf( day ) };
};

module.exports = dayOfWeek;
