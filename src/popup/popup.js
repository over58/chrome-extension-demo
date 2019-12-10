import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

chrome.storage.onChanged.addListener(function(changes, namespace){
  for(var key in changes) {
    var storageChange = changes[key];
    console.log(
      'Storage key "%s" in namespace "%s" changed. ' +
        'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue
    );
  }
})

// 存储
chrome.storage.sync.set({name:'Tom1', sex: 'man1'}, function(){
  console.log('name is set to Tim')
})


chrome.storage.sync.get(["name", "sex"], function(data) {
  message(JSON.stringify(data));
});


chrome.storage.local.set({name: "徐勇超"},function(data){
  console.log(data)
})


chrome.storage.local.get(["name"], function(data) {
  console.log(data)
});


chrome.runtime.onMessage.addListener(function(req) {
});