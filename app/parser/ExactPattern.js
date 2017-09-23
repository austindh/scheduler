// ExactPattern needs exactly specified tokens in order
class ExactPattern {
	constructor( ...tokens ) {
		let patternKey = ExactPattern.getPatternKey( tokens );
		this.patternKey = patternKey;
	}

	static getPatternKey( tokens ) {
		return tokens.map( t => t.type ).join( '_' );
	}

	set getTimeFunction( func ) {
		this._getTime = func;
	}

	getTime( tokens ) {
		let obj = {};
		tokens.forEach( t => {
			let token = t.tokenType;
			let vals = token.extractValues( t.val );
			for ( let key in vals ) {
				let val = vals[ key ];
				obj[ key ] = val;
			}
		});
		return obj;
	}
}

module.exports = ExactPattern;
