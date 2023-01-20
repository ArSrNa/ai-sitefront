function callCHATGPT() {
    if ($('#key').val() == '') { alert('请输入OpenAI API秘钥'); return }
    $('#chatgpt-response').html(`请求中......<br><div class="arloadLine"><div></div></div>`);
    $('#submitBtn').addClass('disabled');
    $('.arloadLine').show();

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
            "model": "text-davinci-003"
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