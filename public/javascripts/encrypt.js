importScripts('/javascripts/libraries/cryptojs/rollups/aes.js');

function encrypt (event){

  var file = event.data.file,
    password = event.data.password,
    reader = new FileReader();

  reader.onload = function(e){
    var arrayBuffer = e.target.result;
    var byteArray = new Uint8Array(arrayBuffer);
    var wordArray = CryptoJS.lib.WordArray.create(byteArray);
    var encrypted = CryptoJS.AES.encrypt(wordArray, password);
    var words = CryptoJS.enc.Base64.parse(encrypted.toString()).words;
    var blob = new Blob(words, {type: file.type});

    postMessage({
     key: encrypted.key.toString()
   , iv: encrypted.iv.toString()
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



