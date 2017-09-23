const Token = require( '../Token' );

let time = new Token( 'time', /([1-9]|1[0-2])(:([0-5][0-9]))? ?(am|pm)/i );

time.extractFunction = regexExec => {
	let [ , hour, , minute, amPm ] = regexExec;
	amPm = amPm.toLowerCase();
	hour = parseInt( hour );
	minute = parseInt( minute ) || 0;

	if ( amPm === 'am' && hour === 12 ) {
		hour -= 12;
	} else if ( amPm === 'pm' && hour !== 12 ) {
		hour += 12;
	}

	return { hour: hour, minute: minute };
};

module.exports = time;
