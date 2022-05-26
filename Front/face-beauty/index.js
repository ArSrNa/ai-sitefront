function ToBase64() {
    var img = document.getElementById('imgfile');
    if (img.value == '') {
        alert('请选择照片！');
    } else {
        document.getElementById('doing').style.display = '';

        /*转换base64*/
        var imgFile = new FileReader();
        imgFile.readAsDataURL(img.files[0]);

        imgFile.onload = function() {
            var imgData = this.result; //base64数据  
            var b64head = imgData.substring(0, imgData.indexOf(','));
            var b64data = imgData.substring(imgData.indexOf(',') + 1);

            //console.log(imgData);
            //console.log(b64head + imgData);
            //dashStart(imgData);
            display(b64head, b64data);
            var input = document.getElementsByClassName('beautyRange');
            var Smoothing = parseInt(input[0].value);
            var Whitening = parseInt(input[1].value);
            var FaceLifting = parseInt(input[2].value);
            var EyeEnlarging = parseInt(input[3].value);
            generate(b64data, Smoothing, Whitening, FaceLifting, EyeEnlarging);
            //console.log(b64data)
        }
    }
}

function display(head, data) {
    document.getElementById('imageOri').src = head + ',' + data;
    var fileName = document.getElementById('imgfile').files[0].name;
    document.getElementById('fileName').innerHTML = fileName;
}


function generate(b64data, Smoothing, Whitening, FaceLifting, EyeEnlarging) {
    $.ajax({
        type: "POST",
        url: "https://api.arsrna.cn/release/araibface",
        data: '{"Base64FileContent":"' + b64data + '","Smoothing":' + Smoothing + ',"Whitening":' + Whitening + ',"FaceLifting":' + FaceLifting + ',"EyeEnlarging":' + EyeEnlarging + '}',
        dataType: 'text',
        success: function(msg) {
            console.log(msg);

            if (("errorCode" in JSON.parse(msg))) {
                alert("发生错误：" + msg);
                window.location.reload()
            } else {
                var msg = JSON.parse(msg)
                document.getElementById("doing").style.display = "none";
                result.generate(msg);
                document.getElementById("imageEff").src = msg.ResultUrl
            }

        },

        error: function(err) {
            console.log(err.status + err.statusText);
            alert('提交失败：' + err.status + err.statusText);
        }

    });
}

var result = {
    generate: function(msg) {
        var resultT = document.getElementsByClassName('lead pti');
        resultT[0].innerHTML = msg.RequestId;
        resultT[1].innerHTML = '<a href="' + msg.ResultUrl + '" target="_blank">' + msg.ResultUrl + '</a>';
    },
}


function rangeChange() {
    var range = document.getElementsByClassName('beautyRange');
    for (c3 = 0; c3 < range.length; c3++) {
        document.getElementsByClassName('brText')[c3].innerHTML = range[c3].value;
    }
}