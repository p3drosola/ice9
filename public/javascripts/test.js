
var clean =  CryptoJS.enc.Utf8.parse("Message");
var encrypted = CryptoJS.AES.encrypt(clean, "password");


var encrypted_array = encrypted.ciphertext.words; // byte arrray here. this goes over the wire
var key_base = CryptoJS.enc.Base64.stringify(encrypted.key);
var iv_base = CryptoJS.enc.Base64.stringify(encrypted.iv);

console.log('over the wire:');
console.log(encrypted_array, key_base, iv_base);

// decryption
var encrypted_words = CryptoJS.lib.WordArray.create(encrypted_array);
var cypherParams = CryptoJS.lib.CipherParams.create({
  ciphertext: encrypted_words
});

var key2 = CryptoJS.enc.Base64.parse(key_base);
var iv2 = CryptoJS.enc.Base64.parse(iv_base);

var decrypted1 = CryptoJS.AES.decrypt(encrypted, "password"); // using passphrase
var decrypted2 = CryptoJS.AES.decrypt(cypherParams, key2, {iv:  iv2}); // using key + iv

var string1 = CryptoJS.enc.Utf8.stringify(decrypted1);
var string2 = CryptoJS.enc.Utf8.stringify(decrypted2);

console.log('decrypted1:', string1);
console.log('decrypted2:', string2);