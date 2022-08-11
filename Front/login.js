function getUser(contents){
    if(!(GetQueryValue('code')==null)){
     ArCIAM.getToken(GetQueryValue('code'),localStorage.getItem('codeVerifier'),
      function(msg){
         localStorage.setItem('CIAM',msg.responseText);
         console.log(msg);
         location.href = funcUrlDel('code').replace('?','')
     });
    }
    tokenAll = JSON.parse(localStorage.getItem('CIAM'));
    if(tokenAll==null){
        console.log('未登录')
        $('#loginButton').show();
        $('#logoutButton').hide();
    }else{
        if(!(JSON.parse(localStorage.getItem('CIAM')).error==null)){
            localStorage.removeItem('CIAM');
        }
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
    }
}

function refreshToken(){
    return(ArCIAM.refreshToken(tokenAll.refresh_token,
    function(msg){
        console.log(JSON.parse(msg.responseText));
        if(JSON.parse(msg.responseText).error==null){
            localStorage.setItem('CIAM',msg.responseText)
            console.log('设置新的token'+msg.responseText)
        }else{
           // localStorage.removeItem('CIAM');
        }
    }).responseText)
     // return(JSON.parse(localStorage.getItem('CIAM')))
  }