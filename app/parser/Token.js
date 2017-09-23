class Token {
	constructor( type, regex ) {
		this.type = type;
		this.regex = regex;

		//Default extract function
		this._extractFunction = string => [ string ];
	}

	set extractFunction( func ) {
		this._extractFunction = func;
	}

	extractValues( string ) {
		return this._extractFunction( this.regex.exec( string ) );
	}
}

module.exports = Token;
