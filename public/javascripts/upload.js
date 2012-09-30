(function(){

  var ice9 = {
    files: {}
  };

  /* Begin view layer functions */

  ice9.initialize = function (){

    $(document)
      .on('dragenter', '#file-input', ice9.drag_enter)
      .on('dragleave', '#file-input', ice9.drag_leave)
      .on('drop', function(){ return false; }) // disable redirect
      .on('drop', '#file-input', ice9.file_drop)
      .on('click', '.encrypt', ice9.encrypt_btn)
    ;

  };

  ice9.drag_enter = function (e) {
    $('#file-input').addClass('drop_target_over');
  };

  ice9.drag_leave = function (e) {
    $('#file-input').removeClass('drop_target_over');
  };

  ice9.file_drop = function (e){
    var files;

    ice9.drag_leave(e);
    files = e.originalEvent.dataTransfer.files;
    $('#file-input').removeClass('empty');

    _(files).each(function(file){
      var $el, cid = _.uniqueId();

      $el = $('<li>'
        + '<div class="progress-round pause">'
          + '<div class="ball"></div>'
          + '<div class="ball1"></div>'
        +'</div>'
        + '<div class="name"></div>'
        + '<div class="status">waiting...</div>'
        + '<div class="progress-linear"></div>'
        + '</li>');

      $el.attr('data-cid', cid)
         .find('.name').text(file.name);



      $('.file-list').append($el);
      ice9.files[cid] = file;
    });

    $('.choose-password').fadeIn();
    $('.password').focus();

    return false; // prevent redirect + stop propagation
  };

  ice9.encrypt_btn = function () {
    var password = $('input.password').val();
    if ($.trim(password) === ''){
      alert('Please type a password');
      return;
    }
    $('.choose-password').slideUp();
    $('.file-list .progress-round' ).removeClass('pause');
    $('.file-list .status').text('Encrypting...');
    ice9.encrypt(ice9.files, password, ice9.upload_file);
  };

  /* End view layer functions */






  /**
   * Encrypts an array of files
   * 
   * @param fileList {Array} of files
   *
   * Will callback with {Object} (name:blob)
   */
  ice9.encrypt = function  (fileList, password, callback) {

    _(fileList).each(function(file, cid){

      var worker = new Worker('/javascripts/encrypt.js');

      worker.addEventListener('message', function(e){
        console.log('encrypt worker returned message: ', arguments);
        ice9.upload_file(cid, file.name, e.data.blob);
      });

      worker.postMessage({
        file: file
      , password: password
      });

    });
  };


  ice9.upload_file = function (cid, name, file){

    console.log("uploading", name, file);
    ice9.text_status(cid, 'Uploading...');

    var xhr = new XMLHttpRequest()
      , form_data = new FormData();
    form_data.append(name, file);
    xhr.open('POST', '/upload', true);

    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var done = (e.loaded / e.total) * 100;
        ice9.text_status(cid, 'Uploaded '+done+'%');
      }
    };

    xhr.onload = function (e){
      
      var data = JSON.parse(e.target.response)
        , link = 'Encrypted Download Link: <pre>http://'
           + location.host + data[0].public_url+'</pre>';

      console.log('upload complete', data);

      $('.file-list li[data-cid='+cid+'] .progress-round').addClass('pause');
      ice9.text_status(cid, link);
    };

    xhr.send(form_data);
 
  };

  ice9.text_status = function(cid, status){
    $('.file-list li[data-cid='+cid+'] .status').html(status);
  };



  ice9.decrypt = function (crypted, password) {
    var aes = new pidCrypt.AES.CTR()
      , cryptedRaw, result;

    aes.initDecrypt(pidCryptUtil.encodeBase64(crypted), password);

    cryptedRaw = pidCryptUtil.toByteArray(crypted);
    cryptedRaw = cryptedRaw.slice(8,cryptedRaw.length);
    result = aes.decryptRaw(cryptedRaw);
    console.log('decrypted:', result);
  };

  _.bindAll(ice9, 'initialize');
  $(ice9.initialize);

  this.ice9 = ice9;

}());