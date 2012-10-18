
var clean =  CryptoJS.enc.Utf8.parse("Message");
var encrypted = CryptoJS.AES.encrypt(clean, "password");


console.log('key:'+ encrypted.key);
console.log('iv:'+ encrypted.iv);

var encrypted_array = encrypted.ciphertext.words; // byte arrray here. this goes over the wire

// decryption
var encrypted_words = CryptoJS.lib.WordArray.create(encrypted_array);
var cypherParams = CryptoJS.lib.CipherParams.create({
  ciphertext: encrypted_words
});


var decrypted1 = CryptoJS.AES.decrypt(encrypted, "password"); // using passphrase
var decrypted2 = CryptoJS.AES.decrypt(cypherParams, encrypted.key, {iv:  encrypted.iv}); // using key + iv

var string1 = CryptoJS.enc.Utf8.stringify(decrypted1);
var string2 = CryptoJS.enc.Utf8.stringify(decrypted2);

console.log('decrypted:', string2);