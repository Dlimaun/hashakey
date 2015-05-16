const alphabet = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";
//const puncts = ".,:;!?-_@#$%*("

// key - your master key. 
// this key will be used to hash the new keys
function Hasher(key){
	this._key = key;
	this._keyIndex = 0;

	this.hash = function(request){
		request.buildOutputCharacters();
		var hash = "";
		for (var i = 0; i < request.keySize; i++){
			var value = this._value(request.service[i % request.service.length]) + this._nextKeyValue();
			if (i % 2 == 0)
				value = value + Math.floor((request.keySize + i*i) / request.service.length);
			if (i % 3 == 0)
				value += Math.floor(value/2);
			if (i % 5 == 0)
				value += i;
			hash += request.char(value);
		}
		return hash;
		//return this._buildResult(request, hash);
	}

	this._nextKeyValue = function(){
		this._keyIndex = (this._keyIndex) % this._key.length;
		var result = this._value(this._key[this._keyIndex]);
		result = Math.floor(result*result/2);
		this._keyIndex += 1;
		return result;
	}

	this._value = function(char){
		// Use ASCII table to pass input
		return char.charCodeAt(0);
	}

	this._buildResult = function(request, hash){
		var data = JSON.parse(JSON.stringify(request));
		data.key = hash;
		return data;
	}
}

// service - the service name that you want to hash.
// keysize - the size o the wanted key you want to use on service.
function KeyRequest(service, keySize){
	this._outputCharacters = "";
	this.useNumbers = false;
	this.useLowercase = false;
	this.userUppercase = false;
	this.service = service;
	this.keySize = keySize;

	// Enable numbers on output
	this.withNumbers = function(){
		this.useNumbers = true;
		return this;
	}
	
	// Enable lowercase characters
	this.withLowercase = function(){
		this.useLowercase = true;
		return this;
	}

	// Enable uppercase characters
	this.withUppercase = function(){
		this.userUppercase = true;
		return this;
	}

	this.buildOutputCharacters = function(){
		this._outputCharacters = "";
		if (this.useNumbers)
			this._outputCharacters += digits;
		if (this.useLowercase)
			this._outputCharacters += alphabet;
		if (this.userUppercase)
			this._outputCharacters += alphabet.toUpperCase();
		//console.log(this._outputCharacters);
	}

	this.char = function(value){
		return this._outputCharacters[value % this._outputCharacters.length];
	}
}

var param1 = process.argv[2];
var param2 = process.argv[3];

var hasher = new Hasher("MinhaSenhaSuperScreta");
var request = new KeyRequest(param1, param2)
	.withLowercase()
	.withUppercase()
	.withNumbers();
var result = hasher.hash(request);
//console.log(request.toJSON());
console.log(JSON.stringify(request));
console.log(result);

