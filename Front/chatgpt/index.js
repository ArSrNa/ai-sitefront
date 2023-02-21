function callCHATGPT() {
    if ($('#key').val() == '') { alert('请输入OpenAI API秘钥'); return }
    localStorage.setItem('question', $("#chat-gpt-input").val())
    localStorage.setItem('key', $('#key').val())
    localStorage.setItem('model', $('#model').val())
    $('#chatgpt-response').html(`请求中......<br><div class="arloadLine answerLoad"><div></div></div>`);
    $('#submitBtn').addClass('disabled');
    $('.answerLoad').show();

    $.ajax({
        url: "https://api.openai.com/v1/completions",
        type: 'POST',
        headers: {
            'Content-Type': "application/json",
            'Authorization': `Bearer ${$('#key').val()}`
        },
        data: JSON.stringify({
            "prompt": $("#chat-gpt-input").val(),
            "max_tokens": 2048,
            "temperature": 0.5,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "model": $('#model').val()
        }),

        success(data) {
            console.log(data);
            var htmlMark = marked.parse(data.choices[0].text);
            $('#chatgpt-response').html(htmlMark);
            hljs.highlightAll();
            $('#req').html(`本次对话ID：${data.id}<br>用量：${data.usage.total_tokens}`);
            $('#submitBtn').removeClass('disabled');
            $('.answerLoad').hide();
            viewGrants()
        },

        error(data) {
            $('#submitBtn').removeClass('disabled');
            $('#req').html(`错误请求`);
            $('#chatgpt-response').html(data);
            hljs.highlightAll();
        }

    })


}


function viewGrants() {
    $('.balance').html(`<div class="arloadLine"><div></div></div>`);
    $.ajax({
        url: 'https://api.openai.com/dashboard/billing/credit_grants',
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
        }
    })
};

