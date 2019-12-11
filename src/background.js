// 当插件安装的时候
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "测试右键菜单",
    onclick: function() {
      // 这种方式在回调里面调用吧，暂时不能在background.js中直接调用
      chrome.notifications.create('', {
        type: "basic",
        iconUrl: "icons/icon_48.png",
        title: "这是标题aaaaa",
        message: "您刚才点击了自定义右键菜单！"
      });
    }
  });

  chrome.contextMenus.create({
    title: "使用Google搜索：%s", // %s表示选中的文字
    contexts: ["selection"], // 只有当选中文字时才会出现此右键菜单
    onclick: function(params) {
      // 注意不能使用location.href，因为location是属于background的window对象
      chrome.tabs.create({
        url:
          "https://www.google.com/search?q=" + encodeURI(params.selectionText)
      });
    }
  });
})

chrome.bookmarks.onCreated.addListener(function() {
  console.log("创建了一个书签");
});

chrome.runtime.onMessage.addListener(function(message, sender, reply) {
  console.log('background')
  console.log(message)
  // if(message.cmd === 'notify') {
    notify()
  // }
})

function notify(){
  console.log('执行...')
  chrome.notifications.create(
    "1111",
    {
      type: "basic",
      iconUrl: './icons/icon_48.png',
      title: "祝福",
      message: "骚年，祝你圣诞快乐！Merry christmas!"
    },
    function(id) {
      console.log('id--->',id)
    }
  );
}

chrome.tabs.onCreated.addListener(function(obj) {
  console.log("onCreated");
});


function getActiveTab () {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      resolve(tabs)
    })
  })
}

// 当活动tab改变的时候，就往content-script发送一条消息
chrome.tabs.onActivated.addListener(function(activeInfo) {
  sendMessageToContentScript({
    from: "popup",
    to: "content",
    data: activeInfo
  });
});

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if (callback) callback(response);
    });
  });
}

// 发送notification
function sendNotification(message, options){
  if('Notification' in window) {
    // ！！！一定要查看chrome或者系统是不是已经将通知给禁掉了
    Notification.requestPermission()
    new Notification(message, options);
  }
}

sendNotification('欢迎来到我的chrome-extension', {
  body: '内容主体',
  icon: './icons/icon_128.png'
})

// 监听地址栏改变给出建议
chrome.omnibox.onInputChanged.addListener((text, suggesst) => {
  console.log('onInputChanged' + text)
  if(!text) return
  if (text === "美女") {
    suggesst([
      { content: "中国" + text, description: "你要找“中国美女”吗？" },
      { content: "日本" + text, description: "你要找“日本美女”吗？" },
      { content: "泰国" + text, description: "你要找“泰国美女或人妖”吗？" },
      { content: "韩国" + text, description: "你要找“韩国美女”吗？" }
    ]);
  } else if (text == "微博") {
    suggest([
      { content: "新浪" + text, description: "新浪" + text },
      { content: "腾讯" + text, description: "腾讯" + text },
      { content: "搜狐" + text, description: "搜索" + text }
    ]);
  } else {
    suggest([
      { content: "百度搜索 " + text, description: "百度搜索 " + text },
      { content: "谷歌搜索 " + text, description: "谷歌搜索 " + text }
    ]);
  }
})

// 用户接受关键字建议
chrome.omnibox.onInputEntered.addListener((text) => {
  // 这里的text就是suggest中的content
  console.log('onInputEntered' + text)
  if(!text) return 
  var href = ''
  if (text.endsWith("美女"))
    href =
      "http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=" + text;
  else if (text.startsWith("百度搜索"))
    href =
      "https://www.baidu.com/s?ie=UTF-8&wd=" + text.replace("百度搜索 ", "");
  else if (text.startsWith("谷歌搜索"))
    href =
      "https://www.google.com.tw/search?q=" + text.replace("谷歌搜索 ", "");
  else href = "https://www.baidu.com/s?ie=UTF-8&wd=" + text;

  openUrlCurrentTab(href)
})


// 当前标签打开某个链接
function openUrlCurrentTab(url)
{
	getCurrentTabId(tabId => {
		chrome.tabs.update(tabId, {url: url});
	})
}

function getCurrentTabId(callback){
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    if(callback) {
      callback(tabs.length ? tabs[0].id : null)
    }
  })
}