(function(){

  var ice9 = {
    files: {}
  };

  /* Begin view layer functions */

  ice9.initialize = function (){

    $(document)
      .on('dragenter', '.container', ice9.drag_enter)
      .on('dragleave', '.container', ice9.drag_leave)
      .on('drop', '#file-input', ice9.file_drop)
      .on('click', '.encrypt', ice9.encrypt_btn)
    ;

  };

  ice9.drag_enter = function (e) {
    $(e.target).addClass('drop_target_over');
  };

  ice9.drag_leave = function (e) {
    $(e.target).removeClass('drop_target_over');
  };

  ice9.file_drop = function (e){
    var files;

    ice9.drag_leave(e);
    files = e.originalEvent.dataTransfer.files;
    $(e.target).find('label').hide();

    _(files).each(function(file){
      var $el, cid = _.uniqueId();

      $el = $('<li><progress value="0" max="100" style="display:none"/></li>');
      $el.append(file.name).attr('data-cid', cid);


      $('.file-list').append($el);
      ice9.files[cid] = file;
    });

    $('.key-info').show();

    return false; // prevent redirect + stop propagation
  };

  ice9.encrypt_btn = function () {
    var password = $('input.password').val();
    if ($.trim(password) === ''){
      alert('Please type a password');
      return;
    }
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

      var worker = new Worker('/javascripts/encrypt_worker.js');

      worker.addEventListener('message', function(e){
        console.log('worker said: ', e.data);
        callback(cid, file.name, e.data.blob);
      });

      worker.postMessage({
        cid: cid
      , file: file
      , password: password
      });

    });
  };


  ice9.upload_file = function (cid, name, file){

    console.log("uploading", name, file);
    
    var xhr = new XMLHttpRequest()
      , form_data = new FormData()
      , $prog = $('.file-list li[data-cid='+cid+'] progress').val(0).show();

    form_data.append(name, file);
    xhr.open('POST', '/upload', true);

    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        $prog.val((e.loaded / e.total) * 50 + 50);
      }
    };

    xhr.send(form_data);
 
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