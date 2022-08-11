function ToBase64() {
  var img = document.getElementById('imgfile');
        if(img.value == '') {
            alert('请选择照片！');
        }
        else {
            document.getElementById('doing').style.display = '';
            document.getElementById('reshead').innerHTML="计算中";
document.getElementById('resnr').innerHTML="计算中";
    /*转换base64*/
    var imgFile = new FileReader();
    imgFile.readAsDataURL(img.files[0]);
 
    imgFile.onload = function () {
        var imgData = this.result; //base64数据  
        var b64head = imgData.substring(0,imgData.indexOf(','));
        var b64data = imgData.substring(imgData.indexOf(',')+1);

//console.log(imgData);
//console.log(b64head + imgData);
//dashStart(imgData);
        display(b64head,b64data);
        generate(b64data);
        //console.log(b64data)
    }
        }
}
function display(head,data) {
	document.getElementById('image').src = head + ',' + data;
	var fileName = document.getElementById('imgfile').files[0].name;
	document.getElementById('fileName').innerHTML = fileName;
}


function generate(b64data) {
 $.ajax({
    headers:{token:tokenAll.access_token},
    type: "POST",
    url: "https://api.arsrna.cn/release/araiphp",
    data: JSON.stringify({"FileContent": b64data}),
    dataType:'json',
   success: function(msg){
    console.log(msg);

if(("errorCode" in msg)) {
	alert("发生错误："+msg);
	window.location.reload()
}
else {
document.getElementById("doing").style.display="none";
result.generate(msg);
}

    },

  error: function(err){
console.log(err.responseJSON);
//alert('提交失败：' + err.status + err.statusText);
}

});
}


var photo = {
	review:function(src) {
layer.open({
  title: '图片预览',
  type:1,
  content: '<img class="img-fluid" alt="aaaaaaaaa" src=' + src + ' />',
  maxmin: true,
});     
	}
}


var result = {
	generate:function(rej) {
		var txadv = {"Block":"建议屏蔽","Review":"建议复审","Pass":"建议通过"};
        var sugIcon = {"Block":"fa-exclamation-triangle","Review":"fa-question-circle","Pass":"fa-check-circle"};
		var textLabel = {"Normal":"正常","Porn":"色情","Abuse":"谩骂","Ad":"广告","Custom":"自定义图片","Sexy":"性感内容","Illegal":"违法的"};
		var reshead = $('#reshead');
		var resnr = $('#resnr');
		var progress = document.getElementsByClassName('totalProgress');
		reshead.html('<i class="fa '+sugIcon[rej.Suggestion]+'" aria-hidden="true"></i>'+txadv[rej.Suggestion]);

		if(textLabel[rej.Label]==null) {
		resnr.html(`${rej.Label} - ${rej.SubLabel}<br />程度：${rej.Score}`);
		$('#totalHeader').html(`场景：${rej.Label}<br />${txadv[rej.Suggestion]}`);
    $('#totalResult').html(`${rej.Label} - ${rej.SubLabel}<br />疑似度：${rej.Score}`);

		}
		else {
        resnr.html(`${textLabel[rej.Label]} - ${rej.SubLabel}<br />程度：${rej.Score}`);
        $('#totalHeader').html(`场景：+${textLabel[rej.Label]}<br />${txadv[rej.Suggestion]}`);
        $('#totalResult').html(`${textLabel[rej.Label]} - ${rej.SubLabel} <br />疑似度：${rej.Score}`);
    }

    $('#totalRes').css('display','')
       for(iprg=0;iprg<progress.length;iprg++) {
        progress[iprg].style.width = rej.Score+'%';
        progress[iprg].innerHTML = rej.Score+"%";
    }

    var date=new Date();
    var dateStr=date.getFullYear()+""+mmdd(date.getMonth()+1)+""+mmdd(date.getDate());
    function mmdd(i) {
  if (i<10) {
  	i="0" + i;
  }
  return i;
 }
    resimageURL=`https://bspcms-1256309736.cos.ap-guangzhou.myqcloud.com/ImageModeration/1257609559/${dateStr}/${rej.RequestId}.jpg`;
      document.getElementsByClassName('pti')[0].innerHTML = rej.FileMD5;
      document.getElementsByClassName('pti')[1].innerHTML = rej.RequestId;
      document.getElementsByClassName('pti')[2].innerHTML = '<a href="'+resimageURL+'" target="_blank">'+resimageURL+"</a>";


var template = [
    {"<>":"span","class":"lead","html":"场景 ${Scene} "},
    {"<>":"span","class":"badge bg-primary text-white","html":"${Suggestion}"},
    {"<>":"span","class":"card-subtitle mb-2 text-muted","html":" 疑似程度：${Score}%"},
    {"<>":"div","class":"progress","html":[
        {"<>":"div","class":"progress-bar","style":"width: ${Score}%","html":"${Score}"}
      ]},    
    {"<>":"span","class":"DetailsNR","html":"标签：${Label}<br />子标签：${SubLabel}<br />疑似度：${Score}%"},
    {"<>":"hr","html":""}
  ];

$('#singleResult').html(json2html.transform(rej.LabelResults,template));
$('#objectResult').html(json2html.transform(rej.ObjectResults,template));
$('#libResult').html(json2html.transform(rej.LibResults,template));
	}
}