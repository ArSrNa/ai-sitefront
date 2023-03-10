function upload(file, callback) {
  fileRandomKey = `ArAI_${parseInt(Math.random() * 1000)}_${new Date().getTime()}_${file.files[0].name}`
  $('#logProgress').show()
  $('#logs').html(`ArAI 文件上传中`);
  cos.putObject({
    Bucket: Bucket, /* 必须 */
    Region: Region,     /* 存储桶所在地域，必须字段 */
    Key: `/ai/face_analyze/${userInfo.id}/${fileRandomKey}`,              /* 必须 */
    StorageClass: 'STANDARD',
    Body: file.files[0], // 上传文件对象
    onProgress: function (progressData) {
      $('#btnSubmit').attr('disabled', '')
      console.log(JSON.stringify(progressData));
      $('.ArProgressLogText').html(`上传中 ${(progressData.percent) * 100}% | ${(progressData.speed / 1000000).toFixed(2)} MB/s`)
      $('#ArProgress').width(`${(progressData.percent) * 100}%`)
    }
  }, function (err, data) {
    console.log(err || data);
    $('#cosreqid').html(data.RequestId)
    if (err) {
      alert(`错误：${err}`)
    }
    //执行回调
    callback(fileRandomKey)
  });
}

function generate(key) {
  $('.ArProgressLogText').html(`IAI处理中...`)
  COSDownload(`/ai/face_analyze/${userInfo.id}/${key}`,
    { 'imageMogr2/thumbnail/2000x2000>': '' },
    (data) => {
      $('#resimg').html(`<img id="origin" class="img-fluid" src="${data}" alt="待上传">`);
      $.ajax({
        url: 'https://api.ai.arsrna.cn/release/faceanalyze',
        headers: { token: tokenAll.access_token },
        data: {
          MaxFaceNum: $('#maxFaceCount').val(),
          Url: data,
          FaceAttributesType: getDetectObj()
        },
        success(msg) {
          $('#btnSubmit').removeAttr('disabled')
          $('#logProgress').hide()
          console.log(msg)
          if (msg.success) {
            //成功回调
            window.allData = msg.data
            display(msg.data)
            $('.ArProgressLogText').html(`成功`)
            localStorage.setItem('airesult', JSON.stringify(msg.data))
          } else {
            layer.open({
              title: "发生错误",
              content: `错误：${msg.data.code}
            <br>
            <small class="text-muted">requestId: ${msg.data.requestId}</small>
              <hr>若错误码为<b>InvalidParameterValue.NoFaceInPhoto</b>请确认图片中是否包含清晰人脸信息
              `,
            });
          }
        },
        error(err) {
          console.warn(err)
        }
      })
    })
}



function generateHtml() {
  var temp = {
    "<>": "div", "class": "form-check col-4", "html": [
      { "<>": "input", "class": "form-check-input detectObject", "type": "checkbox", "value": "${type}", "disabled": "", "checked": "", "html": "" },
      { "<>": "label", "class": "form-check-label", "html": "${label}" }
    ]
  }

  var data = [
    { "type": "Age", "label": "年龄" },
    { "type": "Beauty", "label": "打分" },
    { "type": "Eye", "label": "眼睛相关信息" },
    { "type": "Eyebrow", "label": "眉毛相关信息" },
    { "type": "Gender", "label": "性别信息" },
    { "type": "Hair", "label": "头发信息" },
    { "type": "Hat", "label": "帽子信息" },
    { "type": "HeadPose", "label": "姿态信息" },
    { "type": "Mask", "label": "口罩佩戴信息" },
    { "type": "Mouth", "label": "嘴巴信息" },
    { "type": "Moustache", "label": "胡子信息" },
    { "type": "Nose", "label": "鼻子信息" },
    { "type": "Shape", "label": "脸型信息" },
    { "type": "Skin", "label": "肤色信息" },
    { "type": "Smile", "label": "微笑程度" }
  ]
  $('#detectContainer').html(json2html.transform(data, temp))
}

function getDetectObj() {
  var sel = document.getElementsByClassName('detectObject');
  var obj = [];
  for (var i = 0; i < sel.length; i++) {
    if (sel[i].checked) {
      obj.push(sel[i].value)
    }
  }
  return (obj.toString())
}


function display(msg) {
  $('#iaireqid').html(msg.RequestId)
  if (document.getElementById("origin").complete) {
    console.log('loaded')
    console.log(msg)
    $('#rectangle').show();
    var facePosition = msg.FaceDetailInfos[0].FaceRect;
    var displayImg = document.getElementById('origin');
    var scale = displayImg.height / displayImg.naturalHeight
    $('#rectangle').css({
      width: `${facePosition.Width * scale}px`,
      height: `${facePosition.Height * scale}px`,
      'margin-left': `${facePosition.X * scale}px`,
      'margin-top': `${facePosition.Y * scale}px`,
    })
  }

  var data = msg.FaceDetailInfos[0].FaceDetailAttributesInfo;
  $('#Score').html(data.Beauty);
  $('#ScoreProgress').css('width', data.Beauty + '%');

  $('#judge_Age').html(data.Age);
  $('#judge_Beauty').html(data.Beauty);
  $('#judge_Gender').html(['男性', '女性'][data.Gender.Type]);
  $('#judge_Smile').html(data.Smile);
}



function displayAll() {
  layer.open({
    title: "详细数据",
    content: `<pre>${JSON.stringify(JSON.parse(localStorage.airesult), null, 2)}</pre>`,
  })
}

var resultTable = [
  { "type": "Age", "label": "年龄" },
  { "type": "Beauty", "label": "打分" },
  { "type": "Gender", "label": "性别" },
  { "type": "Smile", "label": "微笑程度" }
];