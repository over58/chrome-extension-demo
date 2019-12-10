console.log('content')
chrome.runtime.onMessage.addListener((req, sender, res) => {
  console.log('收到一条消息...')
  console.table(req, sender, res)
  switch (req.type) {
  }
})


// content 向 popup.js发送一条message
chrome.runtime.sendMessage({
  type: "content",
  data: "content 中的内容"
});

