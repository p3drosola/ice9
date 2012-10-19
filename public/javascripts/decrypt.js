importScripts('/javascripts/libraries/cryptojs/rollups/aes.js');

function decrypt (event) {
  var d = event.data;
  var key = CryptoJS.enc.Base64.parse(d.password);
  var iv = CryptoJS.enc.Base64.parse(d.iv);

  var byteArray = new Int32Array(d.arrayBuffer);
  var words = CryptoJS.lib.WordArray.create(byteArray);

  var cypherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: words
  });

  var decrypted = CryptoJS.AES.decrypt(cypherParams, key, {iv:  iv});

  var buffer = new ArrayBuffer(decrypted.words.length*4);
  var view = new Int32Array(buffer);

  for (var i=0; i<decrypted.words.length; i++){
    view[i] = decrypted.words[i];
  }

  var blob = new Blob([view], {type: d.type});

  postMessage({
    blob: blob
  });
}


this.addEventListener('message', decrypt);
