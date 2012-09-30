importScripts('/javascripts/libraries/pidcrypt/pidcrypt.js',
  '/javascripts/libraries/pidcrypt/pidcrypt_util.js',
  '/javascripts/libraries/pidcrypt/md5.js',
  '/javascripts/libraries/pidcrypt/aes_core.js',
  '/javascripts/libraries/pidcrypt/aes_ctr.js');


var aes_options = {nBits: 256};

/**
 * Converts a File object to a binary string
 * @param  {File}   file
 * @param  {Function} callback is passed  the binary string as the only argument
 */
function file_to_string (file, callback) {
  var reader = new FileReader();
  reader.onload = function(e){
    callback(e.target.result);
  }
  reader.readAsBinaryString(file);
}

/**
 * Encrypts a file & posts a worker response with an encrypted blob
 * @param  {File} file
 * @param  {String} password
 */
function encrypt (file, password) {
  file_to_string(file, function (bin_string) {
    var aes, crypted_bin_string, blob;

    aes = new pidCrypt.AES.CTR();
    aes.init(password, aes_options);
    crypted_bin_string = aes.encryptRaw(bin_string); 
    blob = new Blob([crypted_bin_string], {type: file.type})

    postMessage({
      msg: 'encrypted'
    , blob: blob
    });
  });
}

/**
 * Decrypts a binary string, posts result as a Blob
 * @param  {String} bin_string
 * @param  {String} type mime type of the file
 * @param  {String} password
 */
function decrypt(bin_string, file_type, password){
  var aes, clear_bin_string, blob;

  aes = new pidCrypt.AES.CTR()
  aes.init(password, aes_options);
  clear_bin_string = aes.decryptRaw(bin_string);
  blob = new Blob([clear_bin_string], {type: file_type});

  postMessage({
    msg: 'decrypted'
  , blob: blob
  });

}


this.addEventListener('message', function(e){
  switch(e.data.msg){
    case 'encrypt':
      encrypt(e.data.data.file, e.data.data.password);
    break;
    case 'decrypt':
      decrypt(e.data.data.bin_string, e.data.data.type, e.data.data.password);
    break;
  }
});