// 加载模块
const nedb = require('nedb');
// 创建nedb数据库实例
const db = new nedb({ filename: 'demo.json', autoload: true });

const baseInfo = [
    {
        uid: '16171a38-abbc-4b5d-a936-a5ee5e4a17cc',
        balance: 5000,
    },
    {
        uid: 'a54350b591774db48d5712ad1afdecc9',
        balance: 5000,
    },

];
//db.insert(baseInfo, (error, result) => {
//    //console.log('error:', error);
//    //console.log('result:', result);
//});


db.find({ uid: '16171a38-abbc-4b5d-a936-a5ee5e4a17cc' }, function (err, docs) {
    console.log(docs == '')
});