<template>
  <div class="container">
    <el-tabs v-model="tab" type="card">
      
      <el-tab-pane label="基本功能" name="base">
        <el-form ref="form" label-width="100px">
          <el-form-item label="设置badge">
            <el-switch v-model="badge" @change="changeBadge"></el-switch>
            只有browser_action才能设置
          </el-form-item>
          <el-form-item label="设置背景色">
            <el-color-picker v-model="backgroundColor" @change="setBgColor"></el-color-picker>            
          </el-form-item>
          
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="notifications" name="消息通知">
        <el-form>
          <el-form-item label="发送到content">
            <el-input v-model="messageText" clearable>
              <el-button slot="append" icon="el-icon-search" @click="sendMessage"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="桌面通知">
            <el-input v-model="notificationText">
              <el-button slot="append" size="small" @click="createNotification"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="获取mainfest">
            <el-button type="primary" size="small" @click="getMainfest">button</el-button>
          </el-form-item>
          <el-form-item label="relaod">
            <el-button type="primary" size="small" @click="sendReloadMessage">button</el-button>
          </el-form-item>
          <el-form-item label="书签">
            <el-button type="primary" size="small" @click="getBookmarks">书签</el-button>
            <el-tree :data="bookmarks"></el-tree>
          </el-form-item>
          
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="窗口操作" name="windows">
        <el-form label-width="100px">
          <el-form-item label="更改窗口状态">
            <el-select v-model="windowState" @change="changeWindow">
              <el-option v-for="(item, index) in windowStateList" :value="item.value" :key="index">{{item.label}}</el-option>
            </el-select> 
          </el-form-item>
          <el-form-item label="创建窗口">
            <el-button type="primary" size="small" @click="createWindow">创建窗口</el-button>  
          </el-form-item>
          <el-form-item label="更新url">
            <el-input v-model="newUrl" placeholder="输入新的URL" clearable>
              <el-button slot="append" icon="el-icon-search" @click="updateTab"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="关闭当前页">
            <el-button type="primary" size="small" @click="closeWindow">关闭当前页</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="标签页操作" name="tabs">
        <el-form label-width="100px">
          <el-form-item label="创建标签页">
            <el-button type="primary" size="small" @click="createTab">创建标签页</el-button>  
          </el-form-item>
          <el-form-item label="关闭标签页">
            <el-button type="primary" size="small" @click="closeTab">关闭标签页</el-button>
          </el-form-item>
          <el-form-item label="reload">
            <el-button type="primary" size="small" @click="reloadTab">reload标签页</el-button>
          </el-form-item>
          <el-form-item label="discard">
            <el-button type="primary" size="small" @click="discardTab">discard丢弃标签页</el-button>
          </el-form-item>
          <el-form-item label="getZoom">
            <el-button type="primary" size="small" @click="getZoom">getZoom</el-button>
          </el-form-item>
          <el-form-item label="setZoom">
            <el-input-number v-model="zoom" :min="1" :max="10"></el-input-number>
            <el-button type="primary" size="small" @click="setZoom">setZoom</el-button>
          </el-form-item>
          
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注入script/css" name="inject">
        <el-form label-width="script">
          <el-form-item label="创建标签页">
            <el-button type="primary" size="small" @click="injectScript">注入script</el-button>  
          </el-form-item>
          <el-form-item label="css">
            <el-button type="primary" size="small" @click="injectCss">注入css</el-button>
          </el-form-item>
          
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import icon from '../icons/icon_48.png'
let vm = null


export default {
  data() {
    return {
      tab: "base",
      badge: false,
      backgroundColor: (document.body.style && document.body.style.backgroundColor) ||  'white',
      tabId: 0,
      newUrl: 'http://www.baidu.com',
      messageText:'message 默认内容',
      notificationText: '通知的默认内容',
      bookmarks: [],
      windowState: 'normal',
      windowStateList: [
        {
          label: '最大化',
          value: 'maximized'
        },
        {
          label: '最小化',
          value: 'minimized'
        },
        {
          label: '全屏',
          value: 'fullscreen'
        }
      ],
      zoom: 1
    };
  },
  created(){
    chrome.runtime.onMessage.addListener(function(req) {
      alert(req);
    });
  },
  mounted () {
    
  },
  methods: {
    changeBadge(status) {
      if (status) {
        chrome.browserAction.setBadgeText({ text: "new" });
        chrome.browserAction.setBadgeBackgroundColor({
          color: [255, 0, 0, 255]
        });
      } else {
        chrome.browserAction.setBadgeText({ text: "" });
      }
    },
    setBgColor (color) {
      this.getActiveTab().then(tabs => {
        chrome.tabs.executeScript(tabs[0].id, {
          code: `document.body.style.backgroundColor='${color}';`
        })
      })
    },
    sendMessage () {
      this.getActiveTab().then(tabs => {
        chrome.tabs.sendMessage(tabs[0].id,{type: 'popup', data: '测试哦'})
      })
    },
    getActiveTab() {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          resolve(tabs)
        })
      })
    },
    updateTab () {
      this.getActiveTab().then(tabs => {
        chrome.tabs.update(tabs[0].id, {
          url: vm.newUrl
        })
      })
    }, 
    getMainfest() {
      var obj = chrome.runtime.getManifest()
      this.getActiveTab().then(tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type:'open_mainfest', data: obj})
      })
    },
    sendReloadMessage() {
      chrome.runtime.reload()
    },
    getBookmarks() {
      chrome.bookmarks.getTree(function(data) {
        vm.bookmarks = data
      })
    },
    createNotification () {
      chrome.notifications.create(
        "1111",
        {
          type: "basic",
          iconUrl: '../icons/icon_48.png',
          title: "祝福",
          message: "骚年，祝你圣诞快乐！Merry christmas!"
        },
        function(id) {
          console.log('id--->',id)
        }
      );
    },
    changeWindow (state) {
      chrome.windows.getCurrent({}, currentWindow => {
        chrome.windows.update(currentWindow.id, {
          state: state
        })
      })
    },
    createWindow(){
      chrome.windows.create({
        left: 0,
        top: 0,
        width: 500,
        height: 500,
        focused: true,
        state: 'normal'
      }, function(){
        alert('创建成功')
      })
    },
    closeWindow(){
      // chrome.windows。getCurrent  可以获取到当前window
      chrome.windows.getCurrent({}, currentWindow => {
        chrome.windows.remove(currentWindow.id)
      })
    },
    createTab() {
      chrome.windows.getCurrent(currentWindow => {
        chrome.tabs.create({
          windowId: currentWindow.id,
          url: 'http://www.baidu.com'
        })
      })
    },
    closeTab () {
      this.getActiveTab().then(tabs => {
        chrome.tabs.remove(tabs.map(x =>x.id))
      })
    },
    reloadTab() {
      this.getActiveTab().then(tabs => {
        chrome.tabs.reload(tabs[0].id)
      })
    },
    discardTab(){
      this.getActiveTab().then(tabs => {
        chrome.tabs.discard(tabs[0].id)
      })
    },
    getZoom() {
      this.getActiveTab().then(tabs => {
        chrome.tabs.getZoom(tabs[0].id, function(zoom){
          alert(zoom)
        })
      })
    },
    setZoom() {
      this.getActiveTab().then(tabs => {
        chrome.tabs.setZoom(tabs[0].id, vm.zoom)
      })
    },
    injectCss () {
      this.getActiveTab().then(tabs => {
        chrome.tabs.insertCSS(tabs[0].id, {file: './inject.css'});
      }, function(){
        alert('insert fallback')
      })
    },
    injectScript () {
      this.getActiveTab().then(tabs => {
        // 注意引入文件的路径一定得和打包后的路径对应上
        chrome.tabs.executeScript(tabs[0].id, {
          file: './injectJs.js'
        })
      })
    }
  },
  created() {
    vm = this
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 500px;
  height: 300px;
}
</style>
