$('#logProgress').hide()

function upload(file,callback){
  $('#btnSubmit').attr('disabled','')
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
    Headers:{
      'Pic-Operations': 
        JSON.stringify({
          "is_pic_info": 1,
          "rules": [{
              "fileid": `${filePath}_cop`,
              "rule": "imageMogr2/thumbnail/4665600@"
          }]
        })
    },
    onProgress: function(progressData) {
        console.log(JSON.stringify(progressData));
        $('.ArProgressLogText').html(`上传中 ${(progressData.percent)*100}% | ${(progressData.speed/1000000).toFixed(2)} MB/s`)
        $('#ArProgress').width(`${(progressData.percent)*100}%`)
    }
}, function(err, data) {
    console.log(err || data);
    $('#reqid').html(data.RequestId)
    if(err){
      alert(`错误：${err}`)
    }
    //执行回调
    callback(filePath)
})
}

function generate(key){
  $('.ArProgressLogText').html(`TIIA 处理中...`)
   COSDownload(`${key}_cop`,{},function(msg){
    $('#origin').attr('src',msg);
      $.ajax({
        url:'https://api.ai.arsrna.cn/release/imglabel',
        data:{ImageUrl:msg},
        headers:{
          token:tokenAll.access_token
        },
        dataType:'json',
        success(data){
          if(data.error){
            layer.open({
              title: "发生错误",
              content: `错误：${data.err.code}`,
            });
          }
          $('.ArProgressLogText').html(`完成`)
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
   