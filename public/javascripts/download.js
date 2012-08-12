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
    xhr.responseType = 'text';

    xhr.onload = function(e) {
      if (this.status === 200) {
        var worker = new Worker('/javascripts/encryption.js');
        //new Blob([this.response], {type: ice9.file.type})
        console.log('download complete', this.response, 'decrpyting...');

        worker.addEventListener('message', function(e){
          console.log('decrypted file: ', e.data);
          var blob = new Blob([e.data.bin_string], {type: ice9.file.type})
            , blob_url = window.URL.createObjectURL(blob);
          ice9.download_ready(blob_url);
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


  ice9.download_ready = function (url) {

    var $link = $('<a>')
          .text('Save "' + ice9.file.name+'"')
          .attr('download', ice9.file.name)
          .attr('href', url);

    $('.download').replaceWith($link);
  };


  _.bindAll(ice9, 'initialize');
  $(ice9.initialize);
  this.ice9 = ice9;

  window.URL = window.URL || window.webkitURL;
}());