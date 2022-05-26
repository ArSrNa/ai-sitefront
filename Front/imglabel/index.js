function upload() {
    var imgfile = document.getElementById('imgfile').files
    if(imgfile.length>0){
    if(imgfile[0].size<=15000000){
        $('#doing').show()
        var cos = new COS({
            getAuthorization: function (options, callback) {
                $.ajax({
                 url:'https://api.arsrna.cn/release/arcos',
                 type:'GET',
                 success(data) {
                     var data=JSON.parse(data)
                     console.log(data)
                    var credentials = data && data.credentials;
                    if (!data || !credentials) return console.error('credentials invalid');
                    callback({
                        TmpSecretId: credentials.tmpSecretId,
                        TmpSecretKey: credentials.tmpSecretKey,
                        SecurityToken: credentials.sessionToken,
                        StartTime: data.startTime,
                        ExpiredTime: data.expiredTime,
                    });
                }
            });
         }
         });
    
             filekey = "ArAI"+btoa(Math.random()*100000000)+Math.random().toString(36).slice(-8)
             cos.putObject({
             Bucket: 'temparai-1257609559', /* 必须 */
             Region: 'ap-hongkong',     /* 存储桶所在地域，必须字段 */
             Key: filekey,              /* 必须 */
             StorageClass: 'STANDARD',
             Body: document.getElementById('imgfile').files[0], // 上传文件对象
             onProgress: function(progressData) {
                //  console.log(progressData);
    $('#uploadProgress').html('Ar-Sr-Na AI 提交中 '+(progressData.speed/1000)+'k/s')
    if(progressData.percent==1){
        var imgURL='https://temparai-1257609559.cos.ap-hongkong.myqcloud.com/'+filekey+'_cop'
        display(imgURL)
        generate(scenesG(),imgURL)
    }
             }
          }, function(err, data) {
             //alert(JSON.stringify(err || data));
             console.log(err || data)
          });
    }else{
        alert('错误：文件过大')
    }
    }else{
        alert('错误：未上传文件')
    }
    }
    
    
    function scenesG() {
    var check = document.getElementsByClassName('yhClass');
    var scenes=[]
    for(i1=0;i1<check.length;i1++){
        if(check[i1].checked){
           scenes.push(check[i1].value)
        }else{scenes='["WEB"]'}
    }
    return(scenes);
    }
    
     function display(url) {
        document.getElementById('image').src = url;
        document.getElementById('fileName').innerHTML = url;
    }
    
    function generate(scenes,url) {
     $.ajax({
          type: "GET",
          url: "https://api.arsrna.cn/release/ArAI_ImgLabel",
          data: {
            Scenes:scenes,
            ImageUrl:url
          },
          dataType:"json",
          success: function(msg){
    //   console.log(msg);
      if("errorCode" in msg) {
          alert("发生错误："+msg);
          window.location.reload()
      }
      else {
    document.getElementById("doing").style.display="none";
    $('.pti').html(msg.RequestId);
    resultGenerate(msg);
    display(url)
      }
          },
      
        error: function(err){
      console.log(err.status + err.statusText);
      alert('提交失败：' + err.status + err.statusText);
      }
      
      });
      }
    
    function resultGenerate(msg) {
        var temp = [
            {"<>":"li","class":"list-group-item","html":"${Name}  ${FirstCategory}  ${SecondCategory}"},
            {"<>":"div","class":"progress","html":[
                {"<>":"div","class":"progress-bar bg-success","role":"progressbar","style":"width: ${Confidence}%","aria-valuenow":"${Confidence}","aria-valuemin":"0","aria-valuemax":"100","html":"${Confidence}%"}
              ]}
          ];
          $('#resultDetail').html(json2html.transform(msg.Labels,temp));
    }