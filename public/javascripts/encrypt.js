importScripts('/javascripts/libraries/cryptojs/rollups/aes.js');

function encrypt (event){

  var file = event.data.file,
    password = event.data.password,
    reader = new FileReader();

  reader.onload = function(e){
    var arrayBuffer = e.target.result;
    var byteArray = new Int32Array(arrayBuffer);
    var wordArray = CryptoJS.lib.WordArray.create(byteArray);
    var encrypted = CryptoJS.AES.encrypt(wordArray, password);

    var buffer = new ArrayBuffer(encrypted.ciphertext.words.length*4);
    var view = new Int32Array(buffer);

    for (var i=0; i<encrypted.ciphertext.words.length; i++){
      view[i] = encrypted.ciphertext.words[i];
    }
    var blob = new Blob([view], {type: file.type});

    postMessage({
     key: CryptoJS.enc.Base64.stringify(encrypted.key)
   , iv: CryptoJS.enc.Base64.stringify(encrypted.iv)
   , blob: blob
   });
  }
  reader.readAsArrayBuffer(file);
}


this.addEventListener('message', encrypt);



//   blob = new Blob([clear_bin_string], {type: file_type});

//   postMessage({
//     msg: 'decrypted'
//   , blob: blob
//   });



