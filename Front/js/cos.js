// 存储桶名称，由bucketname-appid 组成，appid必须填入，可以在COS控制台查看存储桶名称。 https://console.cloud.tencent.com/cos5/bucket
var Bucket = 'temporary-1257609559';  /* 存储桶，必须字段 */
// 存储桶region可以在COS控制台指定存储桶的概览页查看 https://console.cloud.tencent.com/cos5/bucket/ 
// 关于地域的详情见 https://cloud.tencent.com/document/product/436/6224
var Region = 'ap-guangzhou';     /* 存储桶所在地域，必须字段 */
// 初始化实例
var cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: function (options, callback) {
      $.ajax({
        headers:{token:tokenAll.access_token},
        url:'https://api.arsrna.cn/release/coskey_write',
        data:{
          bucket:'temporary',
          APPID:1257609559,
          region:'ap-guangzhou'
        },
        type:'POST',
        dataType:'json',
        async:false,
        success(data) {
          console.log(data)
           var credentials = data && data.credentials;
           if (!data || !credentials) return console.error('credentials invalid');
           callback({
               TmpSecretId: data.credentials.tmpSecretId,
               TmpSecretKey: data.credentials.tmpSecretKey,
               SecurityToken: data.credentials.sessionToken,
               StartTime: data.startTime,
               ExpiredTime: data.expiredTime,
           });
       }
   });
    }
});

function COSDownload(key,query,callback){
  cos.getObjectUrl({
    Bucket: 'temporary-1257609559', /* 填入您自己的存储桶，必须字段 */
    Region: 'ap-guangzhou',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
    Key: key,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Sign: true,
    /* 传入的请求参数需与实际请求相同，能够防止用户篡改此HTTP请求的参数 */
    Query: query,
    Protocol:'https:',
   // {
   //   'imageMogr2/thumbnail/200x/': '' 
   // },
}, function (err, data) {
    console.log(err || data.Url);
    if(err) alert(err)
    try{
      callback(data.Url)
    }catch(err){
      console.err(`回调错误: ${err}`)
    }
    return(data.Url)
});
}


var dataURLtoBlob = function (dataurl) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
};

