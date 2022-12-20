$('#logProgress').hide()

function upload(file,callback){
  fileRandomKey = `ArAI_${parseInt(Math.random()*1000)}_${new Date().getTime()}_${file.files[0].name}`
  filePath=`/ai/label/${userInfo.id}/${fileRandomKey}`
  $('#logProgress').show()
  $('#logs').html(`ArAI 文件上传中`);
  cos.putObject({
    Bucket: Bucket, /* 必须 */
    Region: Region,     /* 存储桶所在地域，必须字段 */
    Key: filePath,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: file.files[0], // 上传文件对象
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
        $('#logProgress').html(`<p id="logs" class="col lead">
        ArAI 提交中  ${((progressData.speed/1024).toFixed(2))} kB/s
        </p>
        <div class="spinner-border ms-auto col-1" role="status" aria-hidden="true"></div>`)
    }
}, function(err, data) {
    console.log(err || data);
    if(err){
      alert(`错误：${err}`)
    }
    //执行回调
    callback(filePath)
    COSDownload(filePath,{},
    function(msg){
      $('#origin').attr('src',msg);
    })
});
}

function generate(key){
   COSDownload(key,{},function(msg){
      $.ajax({
        url:'https://api.ai.arsrna.cn/release/imglabel',
        data:{ImageUrl:msg},
        headers:{
          token:tokenAll.access_token
        },
        dataType:'json',
        success(data){
          let template = [
            {"<>":"li","class":"list-group-item","html":"${Name} / ${FirstCategory} / ${SecondCategory}"},
            {"<>":"div","class":"progress","html":[
                {"<>":"div","class":"progress-bar bg-primary","role":"progressbar","style":"width: ${Confidence}%","aria-valuenow":"${Confidence}","aria-valuemin":"0","aria-valuemax":"100","html":"${Confidence}%"}
              ]}
          ];
          $('#imgAnalysis').html(json2html.transform(data.Labels,template));
          //sss = data
          console.log(data);
          $('#logProgress').hide()
      }
      
    })
})
}
   