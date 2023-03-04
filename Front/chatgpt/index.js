var apiLink = ['api.openai.com/v1/completions', 'chat.openai.run/wp-json/ai-chatbot/v1/chat'];
var apiIndex;
function callCHATGPT() {
    if ($('#key').val() == '') { alert('请输入OpenAI API秘钥'); return }
    localStorage.setItem('question', $("#chat-gpt-input").val())
    localStorage.setItem('key', $('#key').val())
    localStorage.setItem('model', $('#model').val())
    $('#chatgpt-response').html(`请求中......<br><div class="arloadLine answerLoad"><div></div></div>`);
    $('#submitBtn').addClass('disabled');
    $('.answerLoad').show();
    var args = [{
        "session": "N/A",
        "prompt": $("#chat-gpt-input").val(),
        "max_tokens": 4000,
        "temperature": 0.8,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "model": 'gpt-3.5-turbo'
    }, {
        "env": "chatbot",
        "session": "N/A",
        "prompt": $("#chat-gpt-input").val(),
        "model": "gpt-3.5-turbo",
        "temperature": 0.8,
        "maxTokens": 1024,
        "maxResults": 1
    }]
    $.ajax({
        url: `https://${apiLink[apiIndex]}`,
        type: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${$('#key').val()}`
        },
        data: JSON.stringify(args[apiIndex]),

        success(data) {
            show(apiIndex, data)
        },

        error(data) {
            showErr(data)
        }

    })


}


function show(apiIndex, data) {
    console.log(data);
    switch (apiIndex) {
        case 0:
            var htmlMark = marked.parse(data.choices[0].text);
            $('#chatgpt-response').html(htmlMark);
            hljs.highlightAll();
            localStorage.setItem('lastConv', htmlMark);
            $('#req').html(`本次对话ID：${data.id}<br>用量：${data.usage.total_tokens}`);
            viewGrants();
            break;

        case 1:
            var htmlMark = marked.parse(data.answer);
            $('#chatgpt-response').html(htmlMark);
            hljs.highlightAll();
            localStorage.setItem('lastConv', htmlMark);
            $('#req').html(`本次用量：${data.usage.total_tokens}`);
            break;
    }





    $('#submitBtn').removeClass('disabled');
    $('.answerLoad').hide();

}

function showErr(data) {
    console.log(data)
    $('#submitBtn').removeClass('disabled');
    $('#chatgpt-response').html(JSON.stringify(data));
    layer.open({
        title: "发生错误",
        content: `${JSON.stringify(data)}
                <hr>若错误与http报错状态码相关，请检查网络是否顺畅。
                `,
    });
    hljs.highlightAll();
}

function viewGrants() {
    $('.balance').html(`<div class="arloadLine"><div></div></div>`);
    $.ajax({
        url: `https://${apiLink}/dashboard/billing/credit_grants`,
        type: 'GET',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${$('#key').val()}`
        },
        success(msg) {
            console.log(msg);
            $('#total').html('$ ' + msg.total_granted);
            $('#used').html('$ ' + msg.total_used);
            $('#total_available').html('$ ' + msg.total_available);
        },
        error(data) {
            layer.open({
                title: "发生错误",
                content: `${JSON.stringify(data)}
                <hr>若错误与http报错状态码相关，请检查网络是否顺畅。
                `,
            });
        }
    })
};

