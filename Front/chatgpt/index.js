function callCHATGPT() {
    if ($('#key').val() == '') { alert('请输入OpenAI API秘钥'); return }
    $('#chatgpt-response').html(`请求中......<br><div class="arloadLine"><div></div></div>`);
    $('#submitBtn').addClass('disabled');
    $('.arloadLine').show();

    $.ajax({
        url: "https://api.ai.arsrna.cn/release/chatgpt/chat",
        type: 'POST',
        headers: {
            'Content-Type': "application/json",
            'token': tokenAll.access_token
        },
        data: JSON.stringify({
            prompt: $("#chat-gpt-input").val(),
            uid: userInfo.sub,
            key: $('#key').val()
        }),

        success(data) {
            console.log(data);
            var htmlMark = marked.parse(data.choices[0].text);
            $('#chatgpt-response').html(htmlMark);
            hljs.highlightAll();
            $('#req').html(`本次对话ID：${data.id}<br>用量：${data.usage.total_tokens}`);
            $('#submitBtn').removeClass('disabled');
            $('.arloadLine').hide();
        },

        error(data) {
            $('#submitBtn').removeClass('disabled');
            $('#req').html(`错误请求`);
            $('#chatgpt-response').html(JSON.stringify(data));
            hljs.highlightAll();
        }

    })


}