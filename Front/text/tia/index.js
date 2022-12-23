function submit(){
  $('.logProgress').show()
      query('tia',{
        text:$('#mainText').val(),
        num:$('#tiaNum').val()
      },
        function(msg){
          var temp=[{"<>":"div","class":"lead","style":"font-size:calc(200%*${Score})","html":"${Word}"},
            {"<>":"div","class":"progress mb-2","html":[
            {"<>":"div","class":"progress-bar","role":"progressbar","style":"width: calc(100%*${Score});","html":"${Score}"}
          ]}];
          var data=msg.responseJSON.data
          //console.log(data)
          if(msg.responseJSON.success){
            $('#tiaAnalysis').html(json2html.transform(data.Keywords,temp))
            $('.logProgress').hide()
          }else{
            alert(`错误：${data}`)
          }
        }
      )

      query('digest',{
        text:$('#mainText').val(),
        length:$('#digestLength').val()
      },
        function(msg){
          var data=msg.responseJSON.data
          //console.log(data)
          if(msg.responseJSON.success){
            $('#digestAnalysis').html(data.Summary)
          }else{
            alert(`错误：${data}`)
          }
        }
      )
  }


function query(mode,args,callback){
  var ajaxbase=$.ajax({
        url:'https://api.ai.arsrna.cn/release/NLP',
        data:Object.assign({mode:mode},args),
        headers:{
          token:tokenAll.access_token
        },
        dataType:'json',
        async:false
}) 
callback(ajaxbase)
}