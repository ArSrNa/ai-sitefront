$('#logs').hide()
function generate(file) {
  var fileRandomKey = `ArAI_${parseInt(Math.random()*1000)}_${new Date().getTime()}_${file.files[0].name}`
  $('#logs').show()
  $('#logs').html(`ArAI 提交中`);
  cos.putObject({
    Bucket: Bucket, /* 必须 */
    Region: Region,     /* 存储桶所在地域，必须字段 */
    Key: fileRandomKey,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: file.files[0], // 上传文件对象
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
        $('#logProgress').html(`<p id="logs" class="col lead">
        ArAI 提交中  ${((progressData.speed/(1024*1024)).toFixed(2))} MB/s
        </p>
        <div class="spinner-border ms-auto col-1" role="status" aria-hidden="true"></div>`)
    }
}, function(err, data) {
    console.log(err || data);
    if(err){
      alert(`错误：${err}`)
    }
    COSDownload(`/${fileRandomKey}`,'',(msg)=>{
      $('#origin').attr('src',msg);
      tiiaAnalysis('AssessQuality',msg,(msg)=>{
        console.log(msg.responseJSON)
        var data=msg.responseJSON;
        var temp=`<div class="lead">清晰度${data.ClarityScore}%</div><div class="progress"><div class="progress-bar"style="width: ${data.ClarityScore}%">${data.ClarityScore}%</div></div><div class="lead">美观度${data.AestheticScore}</div><div class="progress"><div class="progress-bar"style="width: ${data.AestheticScore}%">${data.AestheticScore}%</div></div><hr><table class="table"><thead><tr><th scope="col">项目</th><th scope="col">详情</th></tr></thead><tbody class="table-group-divider"><tr><th>长图</th><td>${data.LongImage}</td></tr><tr><th>黑白图</th><td>${data.BlackAndWhite}</td></tr><tr><th>小图</th><td>${data.SmallImage}</td></tr><tr><th>大图</th><td>${data.BigImage}</td></tr><tr><th>纯色图</th><td>${data.PureImage}</td></tr><tr><th>RequestId</th><td>${data.RequestId}</td></tr></tbody></table>`;
       $('#imgAnalysis').html(temp)
      })
    });
    
    COSDownload(`/${fileRandomKey}`,{'imageMogr2/thumbnail/!200p/sharpen/1000':''},(msg)=>{
        tiiaAnalysis('EnhanceImage',msg,(msg)=>{
          if(msg.status==200){
            var body = dataURLtoBlob(`data:image/png;base64,${msg.responseJSON.EnhancedImage}`);
            cos.putObject({
                Bucket: Bucket, /* 填入您自己的存储桶，必须字段 */
                Region: Region,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
                Key: `enhanced_${fileRandomKey}`,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                Body: body,
            }, function(err, data) {
                console.log(err || data);
                COSDownload(`/enhanced_${fileRandomKey}`,'',(msg)=>{
                  $('#process').attr('src',msg)
                  $('#AfterDownload').removeAttr('disabled')
                  $('#AfterDownload').attr('href',msg+`&response-content-disposition=attachment`)
                  $('#logProgress').html('')
                })
            });
          //console.log(msg)
          
      }else{
        layer.open({
          title:'处理失败',
          content:msg
        })
      }
    })
    
    });


});

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



}
