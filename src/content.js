console.log('content')
chrome.runtime.onMessage.addListener((req, sender, setResponse) => {
  console.log('收到一条消息...')
  console.table(req, sender)
  setResponse('我收到了消息')
})


// content 向 popup.js发送一条message
chrome.runtime.sendMessage({
  type: "content",
  data: "content 中的内容"
});

