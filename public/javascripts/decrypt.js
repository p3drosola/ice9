importScripts('/javascripts/libraries/cryptojs/rollups/aes.js');

function decrypt (event) {

  var arrayBuffer = event.data.arrayBuffer;
  var password = event.data.password;
  var type = event.data.type;
  var byteArray = new Uint8Array(arrayBuffer);
  var wordArray = CryptoJS.lib.WordArray.create(byteArray);
  var decrypted = CryptoJS.AES.decrypt(wordArray, password);
  var blob = new Blob(, {type:type});
  postMessage({
    blob: blob
  });
}


this.addEventListener('message', decrypt);
