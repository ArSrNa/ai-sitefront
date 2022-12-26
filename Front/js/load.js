function generateLoad(text,query){
    var temp=`<div class="container d-flex" style="margin-top:10px;border-radius: 5px;background-color: #e2e2e2;box-shadow: 0px 0px 8px 2px #AAAAAA;">
    <svg xmlns="http://www.w3.org/2000/svg" style="margin: 5px;" width="30" height="30" fill="currentColor" class="bi bi-info-circle-fill" viewBox="0 0 16 16">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg> 
<div class="col-11">
    <div class="lead ArProgressLogText">${text}</div>
    <div class="ArloadLine">
        <div></div>
    </div>
</div>
</div>`

$(query).html(temp)
}