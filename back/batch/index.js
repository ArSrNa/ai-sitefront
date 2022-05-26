function ToBase64() {
  $('#batchRes').html('')
  img = document.getElementById('imgfile');
        if(img.value == '' || !(img.files.length<10)) {
            alert('错误：未选择照片或数量太多');
        }
        else {
          for(c1=0;c1<img.files.length;c1++)
          createElement(c1)
        }
}

function createElement(c1) {
  $.ajax({
    url:'temple.html',
    success(msg){
    $('#batchRes').html($('#batchRes').html()+msg)
    toGen(img,c1)
   // console.log(msg)
    }
  })
}



function toGen(img,count){
document.querySelectorAll('#doing')[0].style.display = '';
document.querySelectorAll('.reshead')[count].innerHTML="计算中";
document.querySelectorAll('.resnr')[count].innerHTML="计算中";
/*转换base64*/
var imgFile = new FileReader();
imgFile.readAsDataURL(img.files[count]);

imgFile.onload = function () {
var imgData = this.result; //base64数据  
var b64head = imgData.substring(0,imgData.indexOf(','));
var b64data = imgData.substring(imgData.indexOf(',')+1);
display(b64head,b64data,count);
generate(b64data,count);
}
}




function display(head,data,count) {
	document.getElementsByClassName('image')[count].src = head + ',' + data;
	var fileName = document.getElementById('imgfile').files[count].name;
	document.getElementById('fileName').innerHTML = fileName;
}


function generate(b64data) {
 $.ajax({
    type: "POST",
    url: "https://api.arsrna.cn/release/araiphp",
    data: '{"FileContent": "' + b64data + '"}',
    dataType:'text',
  success: function(msg){
//console.log(msg);
if(("errorCode" in JSON.parse(msg))) {
	alert("发生错误："+msg);
	window.location.reload()
}
else {
document.getElementById("doing").style.display="none";
result.generate(msg,c1-1);
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
  content: '<img class="img-fluid" alt="图片错误" src=' + src + ' />',
  maxmin: true,
});     
	}
}


var result = {
	generate:function(result,count) {
		var txadv = {"Block":"建议屏蔽","Review":"建议复审","Pass":"建议通过"};
    var sugIcon = {"Block":"fa-exclamation-triangle","Review":"fa-question-circle","Pass":"fa-check-circle"};
		var rej = JSON.parse(result);
		document.getElementsByClassName('reshead')[count].innerHTML='<i class="fa '+sugIcon[rej.Suggestion]+'" aria-hidden="true"></i>'+txadv[rej.Suggestion];
    document.getElementsByClassName('resnr')[count].innerHTML = rej.Score+"%"
    document.getElementsByClassName('totalProgress')[count].style.width = rej.Score+"%"
    document.getElementsByClassName('totalProgress')[count].innweHTML = rej.Score+"%"
    document.getElementsByClassName('resnr')[count].innerHTML=rej.Label+'-'+rej.SubLabel+'<br />程度：'+rej.Score;

document.getElementsByClassName('pti')[0].innerHTML = rej.FileMD5;
document.getElementsByClassName('pti')[1].innerHTML = rej.RequestId;
	}
}