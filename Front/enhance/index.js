$('#logProgress').hide()


function upload(file,mode,callback){
  var args=[
    `ci-process=AISuperResolution`,
    `ci-process=AIEnhanceImage&denoise=${$('#denoise').val()}&sharpen=${$('#sharp').val()}`
  ]
  console.log(args[mode])
  fileRandomKey = `ArAI_Enhance_${parseInt(Math.random()*1000)}_${new Date().getTime()}_${file.files[0].name}`
  $('#logProgress').show()
  $('#logs').html(`ArAI 文件上传中`);
  cos.putObject({
    Bucket: Bucket, /* 必须 */
    Region: Region,     /* 存储桶所在地域，必须字段 */
    Key: `/ai/enhance/${userInfo.id}/${fileRandomKey}`,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: file.files[0], // 上传文件对象
    Headers:{
      'Pic-Operations':
      JSON.stringify({
        "is_pic_info": 1,
        "rules": [{
            "fileid": `/ai/enhance/${userInfo.id}/opt_${mode}_${fileRandomKey}`,
            "rule": args[mode]
        }] 
      })
  },
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
        $('#logProgress').html(`<p id="logs" class="col lead">
        ArAI 提交中  ${((progressData.speed/1024).toFixed(2))} MB/s
        </p>
        <div class="spinner-border ms-auto col-1" role="status" aria-hidden="true"></div>`)
    }
}, function(err, data) {
    console.log(err || data);
    $('#beforeInfo').html(`ETag: ${data.UploadResult.OriginalInfo.ETag}<br>key: ${data.UploadResult.OriginalInfo.Key}`)
    $('#aftInfo').html(`x-cos-request-id: ${data.RequestId}<br>ETag: ${data.ETag}`)
    if(err){
      alert(`错误：${err}`)
    }
    //执行回调
    callback(fileRandomKey)
    //tiia评估质量
    COSDownload(`/ai/enhance/${userInfo.id}/${fileRandomKey}`,'',(msg)=>{
      $('#origin').attr('src',msg);
      tiiaAnalysis('AssessQuality',msg,(msg)=>{
        console.log(msg.responseJSON)
        var data=msg.responseJSON;
        var temp=`<div class="lead">清晰度${data.ClarityScore}%</div><div class="progress">
        <div class="progress-bar"style="width: ${data.ClarityScore}%">${data.ClarityScore}%</div>
        </div><div class="lead">美观度${data.AestheticScore}</div><div class="progress">
        <div class="progress-bar"style="width: ${data.AestheticScore}%">${data.AestheticScore}%</div></div>
        <hr>
        <table class="table"><thead><tr><th scope="col">项目</th><th scope="col">详情</th></tr></thead><tbody class="table-group-divider"><tr><th>长图</th><td>${data.LongImage}</td></tr><tr><th>黑白图</th><td>${data.BlackAndWhite}</td></tr><tr><th>小图</th><td>${data.SmallImage}</td></tr><tr><th>大图</th><td>${data.BigImage}</td></tr><tr><th>纯色图</th><td>${data.PureImage}</td></tr><tr><th>RequestId</th><td>${data.RequestId}</td></tr></tbody></table>`;
       $('#imgAnalysis').html(temp)
      })
    });
});
}

var generate={
  0:function() {
    COSDownload(`/ai/enhance/${userInfo.id}/opt_0_${fileRandomKey}`,'',
    function(msg){
      $('#process').attr('src',msg);
      $('#logProgress').hide()
      $('#AfterDownload').attr('href',msg)
      $('#AfterDownload').removeClass('disabled')
    })
  },


  1:function() {
    COSDownload(`/ai/enhance/${userInfo.id}/opt_1_${fileRandomKey}`,'',
    function(msg){
      $('#process').attr('src',msg);
      $('#logProgress').hide()
      $('#AfterDownload').attr('href',msg)
      $('#AfterDownload').removeClass('disabled')
    })
  },
}


function tiiaAnalysis(path,imageURL,callback){
   var ajaxbase = $.ajax({
    headers:{token:tokenAll.access_token},
    url: "https://api.arsrna.cn/release/tiia/"+path,
    data: {imageUrl:imageURL},
    async:false,
    dataType:'json',
});
$('#logProgress').html(`<p id="logs" class="col lead">
        ArAI TIIA处理中</p>
        <div class="spinner-border ms-auto col-1" role="status" aria-hidden="true"></div>`)
      try{callback(ajaxbase)}
      catch(err){console.warn('TIIA回调错误 '+err)}
}


function changeOptions(val){
  switch(val){
    case '0'||'2':
      $('.optRange').attr('disabled','')
    break;
    case '1':
      $('.optRange').removeAttr('disabled')
    break
  }
}