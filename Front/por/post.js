

/*
function generate(value) {
	// 这个支持新的浏览器
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	// IE5 IE6 老版本浏览器
	else if (window.ActiveXObject) {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if  (xmlhttp != null) {
		// 这里赋一个自定义的state_Change的方法 当状态改变的时候会调用 注意这里没有括号 有括号的那不是函数 而是函数的返回值
		xmlhttp.onReadyStateChange = state_Change;
		// 这个ture是异步
		xmlhttp.open("POST", 'http://localhost:8088/', ture);
		// POST需要设置这个 GET不用
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		// 如果你用GET方法 直接xmlhttp.send(); data直接拼接 ? + data在url后面就可以
		xmlhttp.send(value.replace(/\+/g, "%2B"));
		}
	}
*/