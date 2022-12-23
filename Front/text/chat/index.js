function getKey() {
  if (event.keyCode == 13) {
    send($('#sendMsg').val());
  }
}

function send(text){
  generateLoad('等待中','.logProgress')
  if(text==''){alert('请输入内容')}else{
    addMsg.self(text)
    $.ajax({
      url:'https://api.ai.arsrna.cn/release/NLP',
      data:{
       mode:'chat',
       text:text,
       flag:$('#mode').val()
     },
      headers:{
        token:tokenAll.access_token
      },
      dataType:'json',
      success(msg){
       console.log(msg)
       addMsg.bot(msg)
       $('.logProgress').html('')
      }
   }) 
  }
  
  }


var addMsg={
  self:function(msg) {
  var html = $('#msg').html()
  var tempSelf = `<div style="padding-top:5px" class="text-primary">
  <small>${moment(new Date().getTime()).format('HH:mm:ss')}</small>
  <span>我</span>
  <div class="d-flex">
  <div class="col-auto">
  <i class="fa-solid fa-user fa-fw" style="padding-right:5px"></i>
  </div>
  <div class="col-11">
  <span class="lead">${msg}</span>
  </div></div></div>`;
  $('#msg').html(tempSelf+html)
  },

  bot:function(msg){
  var html = $('#msg').html()
  var tempOther = `<div style="padding-top:5px">
  <small class="text-muted">${moment(new Date().getTime()).format('HH:mm:ss')}</small>
  <span class="text-muted">ArAI</span>
  <span class="badge bg-primary">${(msg.data.Confidence*100).toFixed(2)}</span>
  <div class="d-flex">
  <div class="col-auto">
  <i class="fa-solid fa-robot fa-fw" style="padding-right:5px"></i>
  </div>
  <div class="col-11">
  <span class="lead">${msg.data.Reply}</span>
  </div></div></div>`;
  $('#msg').html(tempOther+html)
  }
  
}