function upload(file,callback){
    fileRandomKey = `ArAI_${parseInt(Math.random()*1000)}_${new Date().getTime()}_${file.files[0].name}`
    filePath = `/ai/face_beauty/${userInfo.id}/${fileRandomKey}`
    $('#logProgress').show()
    $('#logs').html(`ArAI 文件上传中`);
    cos.putObject({
      Bucket: Bucket, /* 必须 */
      Region: Region,     /* 存储桶所在地域，必须字段 */
      Headers:{
        'Pic-Operations': 
          JSON.stringify({
            "is_pic_info": 1,
            "rules": [{
                "fileid": `${filePath}_cop`,
                "rule": `imageMogr2/thumbnail/${1920*1920}@`
            }]
          })
      },
      Key: filePath,              /* 必须 */
      StorageClass: 'STANDARD',
      Body: file.files[0], // 上传文件对象
      onProgress: function(progressData) {
          $('#btnSubmit').attr('disabled','')
          console.log(JSON.stringify(progressData));
          $('.ArProgressLogText').html(`上传中 ${(progressData.percent)*100}% | ${(progressData.speed/1000000).toFixed(2)} MB/s`)
          $('#ArProgress').width(`${(progressData.percent)*100}%`)
      }
  }, function(err, data) {
      console.log(err || data);
      $('#cosreqid').html(data.RequestId)
      if(err){
        layer.open({
            title: "上传时发生错误",
            content: `错误：${err}`,
          });
      }
      //执行回调
      callback(`${filePath}_cop`)
  });
  }




function generate(url, Smoothing, Whitening, FaceLifting, EyeEnlarging) {
    $('.ArProgressLogText').html(`FMU 处理中...`)
    $.ajax({
        headers:{token:tokenAll.access_token},
        url: "https://api.ai.arsrna.cn/release/fmu",
        data: {
            options:JSON.stringify({
            "Url": url,
            "Smoothing": parseInt(Smoothing),
            "Whitening": parseInt(Whitening),
            "FaceLifting": parseInt(FaceLifting),
            "EyeEnlarging": parseInt(EyeEnlarging),
            "RspImgType": "url"
        })
    },
        complete(){
            $('#submitBtn').removeAttr('disabled')
        },
        success: function(msg) {
            $('.ArProgressLogText').html('完成')
            console.log(msg);
            if(msg.error){
                layer.open({
                    title: "FMU处理过程中发生错误",
                    content: `错误：${msg.data.code}
                    <hr>
                    <small>RequestID: ${msg.data.requestId}</small>`,
                  });
            }
            $('#imageEff').attr('src',msg.ResultUrl)
            $('#downloadRes').html(`<a href="${msg.ResultUrl}" target="_blank">${msg.ResultUrl}</a>`)
            $('#reqid').html(msg.RequestId)
            $('#imageOri,#imageEff').css('filter','')
            $('#imgfile').val('')
        },

        error: function(err) {
            console.log(err.status + err.statusText);
            alert('提交失败：' + err.status + err.statusText);
        }

    });
}



function rangeChange() {
    var range = document.getElementsByClassName('beautyRange');
    for (c3 = 0; c3 < range.length; c3++) {
        document.getElementsByClassName('brText')[c3].innerHTML = range[c3].value;
    }
}

$(document).ready(()=>{
    $('#imgfile').change((msg)=>{
        if(msg.target.files[0].size/1000000>=5){
            layer.msg('文件过大，请重新选择')
            msg.target.value=''
            msg.target.click()
        }
    })

    $('#submitBtn').click(function(){
        $('#imageOri,#imageEff').css('filter','blur(5px) brightness(0.5)')
        if($('#imgfile')[0].files.length==0){
            layer.msg('请先选择文件')
        }else{
        upload($('#imgfile')[0],(key)=>{
            COSDownload(key,{},function(msg){
                console.log([key,msg])
                $('#imageOri').attr('src',msg)
                var input = document.getElementsByClassName('beautyRange');
                var Smoothing = input[0].value;
                var Whitening = input[1].value;
                var FaceLifting = input[2].value;
                var EyeEnlarging = input[3].value;
                generate(msg, Smoothing, Whitening, FaceLifting, EyeEnlarging);
            })
         });
         this.setAttribute('disabled','')
        }
    })
})