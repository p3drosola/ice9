importScripts('/javascripts/libraries/pidcrypt/pidcrypt.js',
  '/javascripts/libraries/pidcrypt/pidcrypt_util.js',
  '/javascripts/libraries/pidcrypt/md5.js',
  '/javascripts/libraries/pidcrypt/aes_core.js',
  '/javascripts/libraries/pidcrypt/aes_ctr.js');

function encrypt(file, password){

  var aes = new pidCrypt.AES.CTR()
    , options = {nBits: 256} // keylength
    , reader = new FileReader();

  reader.onload = function(e){
    var buffer = e.target.result
      , byteArray = new Uint8Array(buffer)
      , crypted = aes.encryptRaw(byteArray)
      , blob = new Blob([crypted], {type: file.type})

    postMessage({
      msg: 'encrypted'
    , blob: blob
    });
  };

  aes.init(password, options);
  reader.readAsArrayBuffer(file);
}

function decrypt(buffer, base64, password){
  var aes = new pidCrypt.AES.CTR()
    , crypted = String.fromCharCode.apply(null, new Uint16Array(buffer))
    , cryptedRaw, result;

  aes.initDecrypt(pidCryptUtil.encodeBase64(crypted), password);

  cryptedRaw = pidCryptUtil.toByteArray(crypted);
  cryptedRaw = cryptedRaw.slice(8,cryptedRaw.length);
  result = aes.decryptRaw(cryptedRaw);

  postMessage({
    msg: 'decrypted'
  , blob: result
  });

}


this.addEventListener('message', function(e){

  switch(e.data.msg){
    case 'encrypt':
      encrypt(e.data.data.file, e.data.data.password);
    break;
    case 'decrypt':
      decrypt(e.data.data.buffer, e.data.data.base64, e.data.data.password);
    break;
  }
  
  
});