const expect = require( 'chai' ).expect;

const newSchedule = require( '../app' );
const { parse, schedule } = newSchedule;

describe( 'Better scheduler', () => {

	let testParse = ( string, timeObj ) => expect( parse( string ) ).to.deep.equal( timeObj );

	it( 'Parses regular times', () => {
		testParse( '2am', { hour: 2, minute: 0 });
		testParse( 'daily at 2 am', { hour: 2, minute: 0 });
		testParse( '2:00am', { hour: 2, minute: 0 });
		testParse( '12am', { hour: 0, minute: 0 });
		testParse( '6:30 pm', { hour: 18, minute: 30 });
		testParse( '12pm', { hour: 12, minute: 0 });
		testParse( '11pm', { hour: 23, minute: 0 });
		testParse( '12PM', { hour: 12, minute: 0 });
		testParse( '4:04 PM', { hour: 16, minute: 4 });
	});

	it( 'Parses weekly times (day at time)', () => {

		let monAt6 = { dayOfWeek: 1, hour: 18, minute: 0 };

		testParse( 'Monday at 6pm', monAt6 );
		testParse( 'Mondays at 6pm', monAt6 );
		testParse( 'mon, 6pm', monAt6 );
		testParse( '6pm every Monday', monAt6 );

	});

	const isJobObject = obj => {
		expect( obj ).to.haveOwnProperty( 'job' );
		expect( obj ).to.haveOwnProperty( 'name' );
		expect( obj ).to.haveOwnProperty( 'cancel' );
		expect( obj.constructor.name ).to.equal( 'Job' );
	};

	it( 'Schedules properly using node-schedule', () => {
		let a = schedule( 'Mondays at 6pm', () => console.log( 'hi' ) );
		isJobObject( a );
	});

	it( 'schedule() can take string, Date object, or normal node-scheduler object', () => {
		let func = () => {};
		isJobObject( schedule( new Date, func ) );
		isJobObject( schedule({ hour: 12, minute: 0, func }) );
	});

});
