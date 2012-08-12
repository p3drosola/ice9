importScripts('/javascripts/libraries/pidcrypt/pidcrypt.js',
  '/javascripts/libraries/pidcrypt/pidcrypt_util.js',
  '/javascripts/libraries/pidcrypt/md5.js',
  '/javascripts/libraries/pidcrypt/aes_core.js',
  '/javascripts/libraries/pidcrypt/aes_ctr.js');

this.addEventListener('message', function(e){

  var file = e.data.file
    , cid = e.data.cid
    , password = e.data.password
    , aes = new pidCrypt.AES.CTR()
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
});