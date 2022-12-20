var __html=
`<li class="nav-item active"> <a class="nav-link" href="#">主站 <span class="sr-only">(current)</span></a> </li>
<li class="nav-item"> <a class="nav-link" href="https://console.cloud.tencent.com/api/explorer" target="_blank">腾讯云API中心</a> </li>
<li class="nav-item"> <a class="nav-link" href="https://ai.qq.com/" target="_blank">腾讯AI开放中心</a> </li>


<li class="nav-item dropdown">
  <a class="nav-link dropdown-toggle" href="#" id="products" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    产品
  </a>
  <ul class="dropdown-menu" aria-labelledby="products">
               <h6 class="dropdown-header">图像分析</h6>
               <li><a class="dropdown-item" href="https://ai.arsrna.cn/por/">鉴黄</a></li>
                <li><a class="dropdown-item" href="https://ai.arsrna.cn/imglabel/">图像标签</a></li>
           <div class="dropdown-divider"></div>
               <h6 class="dropdown-header">图像处理</h6>
               <li><a class="dropdown-item" href="https://ai.arsrna.cn/face-beauty/">图像美化-美颜</a></li>
               <li><a class="dropdown-item" href="https://ai.arsrna.cn/enhance/">图像增强与超分辨率</a></li>
            </ul>
</li>`


$('#mainNavContent').html(__html)


function changeBg(url,select,defaultBg) {
  if(defaultBg){
    //选择默认背景时
    $("#bgFilePath").html('默认背景');
    localStorage.setItem('backgroundURL','https://res.arsrna.cn/%E5%B4%A9%E5%9D%8F3/307e97670bccb52217793c37875db3b6_4575220996410919312.png_web');
  }else{
     $("#bgFilePath").html(url);
     localStorage.setItem('backgroundURL',url);
  }
  localStorage.setItem('backgroundSwitch',select);
  location.reload()
}

function startChangeBg() {
  var url = localStorage.getItem('backgroundURL'),
      open = localStorage.getItem('backgroundSwitch');
      //背景设置部分
  if(open=='true'){
    $("#bgFilePath").html(url);
    $("#bgSwitch")[0].checked = true;
    $('.backgroundImg').attr('src',url)
  }else{
    $(".backgroundImg").remove();
    $("#bgSwitch")[0].checked = false;
  }
}