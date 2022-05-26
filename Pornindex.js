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
    type: "POST",
    url: "https://api.arsrna.cn/release/araiphp",
    data: '{"FileContent": "' + b64data + '"}',
    dataType:'text',
  success: function(msg){
console.log(msg);

if(("errorCode" in JSON.parse(msg))) {
	alert("发生错误："+msg);
	window.location.reload()
}
else {
document.getElementById("doing").style.display="none";
result.generate(msg);
}

    },

  error: function(err){
console.log(err.status + err.statusText);
alert('提交失败：' + err.status + err.statusText);
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
	generate:function(result) {
		var textSuggestion = {"Block":"建议屏蔽","Review":"建议复审","Pass":"建议通过"};
		var textLabel = {"Normal":"正常","Porn":"色情","Abuse":"谩骂","Ad":"广告","Custom":"自定义图片","Sexy":"性感内容"};
		var reshead = document.getElementById('reshead');
		var resnr = document.getElementById('resnr');
		var resultjson = JSON.parse(result);
		var progress = document.getElementsByClassName('totalProgress');
		reshead.innerHTML = textSuggestion[resultjson.Suggestion];

		if(textLabel[resultjson.Label]==null) {
			resnr.innerHTML = resultjson.Label+'-'+resultjson.SubLabel+'<br />程度：'+resultjson.Score;
		document.getElementById('totalHeader').innerHTML='场景：'+resultjson.Label+'<br />'+textSuggestion[resultjson.Suggestion];
        document.getElementById('totalResult').innerHTML=resultjson.Label+'-'+resultjson.SubLabel+'<br />疑似度：'+resultjson.Score;

		}
		else {
        resnr.innerHTML = textLabel[resultjson.Label]+'-'+resultjson.SubLabel+'<br />程度：'+resultjson.Score;
        document.getElementById('totalHeader').innerHTML='场景：'+textLabel[resultjson.Label]+'<br />'+textSuggestion[resultjson.Suggestion];
        document.getElementById('totalResult').innerHTML=textLabel[resultjson.Label]+'-'+resultjson.SubLabel+'<br />疑似度：'+resultjson.Score;

    }

        document.getElementById('totalRes').style.display='';
       for(iprg=0;iprg<progress.length;iprg++) {
        progress[iprg].style.width = resultjson.Score+'%';
        progress[iprg].innerHTML = resultjson.Score+"%";
    }

    var date=new Date();
    var dateStr=date.getFullYear()+""+mmdd(date.getMonth()+1)+""+mmdd(date.getDate());
    function mmdd(i) {
  if (i<10) {
  	i="0" + i;
  }
  return i;
 }
    resimageURL="https://bspcms-1256309736.cos.ap-guangzhou.myqcloud.com/ImageModeration/1257609559/"+dateStr+'/'+resultjson.RequestId+".jpg";
        document.getElementsByClassName('pti')[0].innerHTML = resultjson.FileMD5;
        document.getElementsByClassName('pti')[1].innerHTML = resultjson.RequestId;
        document.getElementsByClassName('pti')[2].innerHTML = '<a href="'+resimageURL+'" target="_blank">'+resimageURL+"</a>";


       /* for(i0=0;i0<resultjson.LabelResults.length;i0++) {
        	var resAll = resultjson.LabelResults[i0];
        	var resAllLine = '场景：'+resAll.Scene+'\n建议：'+resAll.Suggestion+'\n内容：'+resAll.Label+'\n程度：'+resAll.Score +resAllLine
        	


      if(resultjson.LabelResults[i0].Details.length > 0) {
        for(i1=0;i1<resultjson.LabelResults[i0].Details.length;i1++) {
        	var resAllDetails = resultjson.LabelResults[i0].Details[i1];
        	var resAllDetailsLine = '详细内容：'+resAllDetails.Name+'\n疑似程度：'+resAllDetails.Score+resAllDetailsLine
        	
        }
        console.log(resAllDetailsLine);
        console.log(resAllLine);
    }

        }


for(i5=0;i5<resultjson.LabelResults.length;i5++) {
                for(i6=0;i6<resultjson.LabelResults[i5].Details.length;i6++) {
                    var deR = resultjson.LabelResults[i5].Details[i6];
                    var deRJson = deR
                }
            }
       */

var template = {"<>":"div","class":"card-body","html":[
    {"<>":"h5","class":"card-title","html":"该项建议${textSuggestion[Suggestion]}"},
    {"<>":"h6","class":"card-subtitle mb-2 text-muted","html":"疑似程度：${Score}%"},
    {"<>":"p","class":"card-text","html":"场景-${Label}-${SubLabel}"},
    {"<>":"p","class":"lead","html":"详细内容"},
    {"<>":"p","class":"DetailsNR","html":"无<hr />"}
  ]};

 document.getElementById('singleResult').innerHTML = json2html.transform(resultjson.LabelResults,template);

var DetailsNR=document.getElementsByClassName('DetailsNR');
for(i0=0;i0<resultjson.LabelResults.length;i0++) {
	var dyD = resultjson.LabelResults[i0].Details;
	for(i6=0;i6<dyD.length;i6++) {
	var i7inner = '详细ID：'+dyD[i6].Id+'<br />名称：'+dyD[i6].Name+'<br />疑似度：'+dyD[i6].Score;
	DetailsNR[i0].innerHTML= i7inner;
}
}


	}
}