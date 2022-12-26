console.log(`
####    ##                    #         
#        #                              
###      #    #  #   ####    ##     ### 
#        #    #  #   ##       #    #  # 
#        #    ## #     ##     #    #  # 
####    ###     ##   ####    ###    ####
              #  #
               ##
`)
console.log('Powered by ArSrNa RenderInfinity')
console.warn('我永远喜欢爱莉希雅！')
console.error('不，你喜欢布洛妮娅！')
console.warn('布洛妮娅天下第一！')
console.error('可是希儿会叫你起床！！！')
console.warn('我全都要')
function upload(file,mode,callback){
  $('#logProgress').show()
  var args=[
    `ci-process=AISuperResolution`,
    `ci-process=AIEnhanceImage&denoise=${$('#denoise').val()}&sharpen=${$('#sharp').val()}`
  ]
  //console.log(args[mode])
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
        //console.log(JSON.stringify(progressData));
        $('.ArProgressLogText').html(`ArAI 上传中 ${(progressData.percent)*100}% | ${progressData.speed} B/s`)
        $('#ArProgress').width(`${(progressData.percent)*100}%`)
    }
}, function(err, data) {
    //console.log(err || data);
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
        //console.log(msg.responseJSON)
        var data=msg.responseJSON;
        var resCss={true:'是',false:'否'}
        var temp=`<div class="lead">清晰度${data.ClarityScore}%</div><div class="progress">
        <div class="progress-bar"style="width: ${data.ClarityScore}%">${data.ClarityScore}%</div>
        </div><div class="lead">美观度${data.AestheticScore}</div><div class="progress">
        <div class="progress-bar"style="width: ${data.AestheticScore}%">${data.AestheticScore}%</div></div>
        <hr>
        <table class="table"><thead><tr><th scope="col">项目</th><th scope="col">详情</th></tr></thead><tbody class="table-group-divider"><tr>
        <th>长图</th><td>${resCss[data.LongImage]}</td></tr><tr>
        <th>黑白图</th><td>${resCss[data.BlackAndWhite]}</td></tr><tr>
        <th>小图</th><td>${resCss[data.SmallImage]}</td></tr><tr>
        <th>大图</th><td>${resCss[data.BigImage]}</td></tr><tr>
        <th>纯色图</th><td>${resCss[data.PureImage]}</td></tr><tr>
        <th>RequestId</th><td>${resCss[data.RequestId]}</td></tr></tbody></table>`;
       $('#imgAnalysis').html(temp)
      })
    });
});
}


function judgeSize(file){
  var img = new Image();
  img.onload = function(){    
      // 获取原宽高
      if(file.files[0].size/Math.pow(1024,2)>5||img.naturalHeight>1920||img.naturalWidth>1920){
        layer.msg('文件不符合要求（大小<5M，分辨率<1920*1920），请重新选择')
        $('#btnSubmit').attr('disabled','')
        file.click();
        file.value='';
      }else{
        $('#btnSubmit').removeAttr('disabled')
      }
      if(file.files.length==0){
        $('#btnSubmit').attr('disabled','')
      }else{
        $('#btnSubmit').removeAttr('disabled')
      }
  }
  //把图片 插插插插 进去
  img.src=URL.createObjectURL(file.files[0])
  
}

var generate={
  0:function() {
    COSDownload(`/ai/enhance/${userInfo.id}/opt_0_${fileRandomKey}`,'',
    function(msg){
      $('#process').attr('src',msg);
      $('.ArProgressLogText').html(`200 OK`)
      $('#AfterDownload').attr('href',msg)
      $('#AfterDownload').removeClass('disabled')
    })
  },


  1:function() {
    COSDownload(`/ai/enhance/${userInfo.id}/opt_1_${fileRandomKey}`,'',
    function(msg){
      $('#process').attr('src',msg);
      $('.ArProgressLogText').html(`200 OK`)
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