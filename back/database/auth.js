var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
// 加载模块
const nedb = require('nedb');
// 创建nedb数据库实例
const db = new nedb({ filename: './mnt/AI/ChatGPT/db.json', autoload: true });
const app = require('express')();

app.get('/auth', (req, res) => {
    var response = {
        'keyAuth': false, // 必须返回，表示认证结果
        'balance': false
    }

    var msg = req['headers'].token
    var keys = {
        '31a4813083e14fad99d92f9c0337b6bc': {
            "kty": "RSA",
            "e": "AQAB",
            "kid": "31a4813083e14fad99d92f9c0337b6bc",
            "n": "o2s2j7oUGtrA9mmDngK4yxV-gQlLGlBY5RGXRTteTwwMrKOonywZ43ksC9VpRvuHNjY-2180k5sosCEcURNyIumj94aVHwU0EYu26iac9iam26zkQWsx00dv_jPh0Gu1lqtHf33O-IDae1Cxs3dLKML87ByTrA7y2oJEt-KmWR235LmpKOa9g0YucjG4_MCgZ1qGYC_nPoxpy4UohGJxhAuS7L3btwKFbFFUCYJw2WgGoFYeXOgUBIujA6Mx8jVfWLQE6e0Fgdu3QC-Cpcm9mqg-3wtvkT14CUujed78h2WoNSM_Gft9rSKzfvV01XjUl-w4hxK5tVqlLWWvJmay-w"
        },
        'aa63c55fe4ce40538734dd6747188d62': {
            "kty": "RSA",
            "e": "AQAB",
            "kid": "aa63c55fe4ce40538734dd6747188d62",
            "n": "o-gCNXPlfGzm8Wxdua3lT7KozmEebWwnUAvtC1D3DhM66Sp-CPpZ1TL5_ZdPCuu_mnHeji9wLzSBASEX0LTgzMoPyKpW7stpQLMS_bPdv9dS4JF0gDjNQntJhD2JNdx0bn54cImX0jZOyK9cApYqBq9eOJxIgteisNswi46jvLEYQLB1O4Q7som15s8aG918ew5_iiBlHkcNaIdDrsU6NbDct9Cw2VPqtxy10SN14-MK8hx1B6TAyVChnHKmDy_CsuUzUGwfGSNPCg0TSuMtIZ2Eh_n2lhzJxoH2sopR0Wuaigwg-H60NMCBTz_Ef7DHlxJZclkQFfvslUa4Z_nh6Q"
        }
    };


    var date = parseInt(new Date().getTime() / 1000);
    var header = JSON.parse(new Buffer.from(msg.split('.')[0], 'base64').toString('utf8'));
    //var payload=JSON.parse(new Buffer.from(msg.split('.')[1],'base64').toString('utf8'));
    jwt.verify(msg, jwkToPem(keys[header.kid]), { algorithms: ['RS256'] }, (err, data) => {
        console.log(data.sub);
        if (err || date >= data.exp || date <= data.iat) {
            //当报错，超过有效期，提前过开始时间判断为虚假用户
            console.log('假用户');
            response['keyAuth'] = false;
        } else {
            console.log('真用户');
            response['keyAuth'] = true;
        }
        //console.log(data)


        db.find({ uid: data.sub }, (error, docs) => {
            getBalance(docs);
            console.log({ docs, error });
            if (docs == '') {
                console.log('没数据')
                db.insert({
                    uid: data.sub,
                    balance: 5000
                })
                getBalance(docs)
            }

        });

        function getBalance(dt) {
            var docs = dt[0]
            console.log(docs.balance);
            if (docs.balance <= 0) {
                //余额不足回调
                response.balance = false;
            } else {
                //余额正常回调
                response.balance = true;
            }
            console.log(response);
            res.send({ 'api-auth': response.keyAuth && response.balance })
        }

    });

})


app.listen(3001)