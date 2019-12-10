// 当插件安装的时候
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "测试右键菜单",
    onclick: function() {
      chrome.notifications.create('', {
        type: "basic",
        iconUrl: "icons/icon_48.png",
        title: "这是标题",
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
    data: activeInfogo
  });
});

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      if (callback) callback(response);
    });
  });
}