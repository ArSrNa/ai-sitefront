function getUser(contents,hideContent){
    if(!(GetQueryValue('code')==null)){
     ArCIAM.getToken(GetQueryValue('code'),localStorage.getItem('codeVerifier'),
      function(msg){
        $.cookie('CIAM',msg.responseText,{expire:7,path:'/'})
         console.log(msg);
         location.href = funcUrlDel('code').replace('?','')
     });
    }
    
    if($.cookie('CIAM')==null){
        console.log('未登录')
        $('#loginButton').show();
        $('#logoutButton').hide();
    }else{
        if(!(JSON.parse($.cookie('CIAM')).error==null)){
            $.removeCookie('CIAM',{path:'/'})
        }
        tokenAll = JSON.parse($.cookie('CIAM'));
        //已登录回调
        refreshToken()
        idToken = tokenAll.id_token;
        accessToken = tokenAll.assess_token;
        userInfo = JSON.parse(atob(idToken.split('.')[1]));
        console.log(userInfo)
        $('#loginButton').hide();
        $('#logoutButton').show()
        $('#user').html(userInfo.nickname);
        $(contents).removeAttr('disabled');
        $(hideContent).hide()
    }
}

function refreshToken(){
    return(ArCIAM.refreshToken(tokenAll.refresh_token,
    function(msg){
        console.log(JSON.parse(msg.responseText));
        if(JSON.parse(msg.responseText).error==null){
            $.cookie('CIAM',msg.responseText,{expire:7,path:'/'})
            console.log('设置新的token'+msg.responseText)
        }else{
           //  $.removeCookie('CIAM'.{path:'/'})
        }
    }).responseText)
     // return(JSON.parse(localStorage.getItem('CIAM')))
  }