(function(){

  var ice9 = {};

  ice9.initialize = function(){
    $(document).on('click', '.download', this.download);
  };


  ice9.download = function(){
    ice9.password = prompt('Password');
    console.log('downloading ', ice9.file.raw_url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ice9.file.raw_url, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      if (this.status === 200) {
        var worker = new Worker('/javascripts/encryption.js');
        //new Blob([this.response], {type: ice9.file.type})
        console.log('download complete', this.response, 'decrpyting...');

        worker.addEventListener('message', function(e){
          console.log('decrypted file: ', String.fromCharCode.apply(null, new Uint16Array(e.data)));
          //var blob_url = window.URL.createObjectURL(e.data.blob);
          //window.location = blob_url;
        });

        worker.postMessage({
          msg: 'decrypt'
        , data: {
            buffer: this.response
          , password: ice9.password
          }
        });
      }
    };

    xhr.send();
  };


  _.bindAll(ice9, 'initialize');
  $(ice9.initialize);
  this.ice9 = ice9;

  window.URL = window.URL || window.webkitURL;
}());