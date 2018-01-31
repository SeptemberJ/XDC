//const MD5 = require('../../../utils/md5.js')
import h from '../../../utils/url.js'
var app = getApp()
Page({
  data: {
      recycleno:'',
      recycleInfor:[],
      loadingHidden:true,
      canDo:false,
      type:''
    
  },

  onLoad: function(options) {
      this.setData({
        type:options.type || ''
      })
      console.log('type-----'+this.data.type)
      wx.request({
        url: h.main+'/page/listbygroup1.html',
        data: {
            recycleno:options.recycleno,
            sessionid: app.globalData.sessionid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
        success:(res)=>{
          switch(res.data)
                {
                case 8:
                wx.showModal({    
                    title:'提示',    
                    content: '您目前的账户在另外登录!',  
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {
                            wx.navigateTo({
                              url: '../../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                // success
                console.log(res.data)
                this.setData({
                  recycleno:options.recycleno,
                  recycleInfor:res.data
                })
                console.log(this.data.recycleInfor)
                }
          
        },
        fail: (res)=>{
          // fail
        },
        complete: (res)=>{
          // complete
        }
      })
  },
  // 入库
  putInStorage: function(e){
      this.setData({
        loadingHidden:false,
        canDo:true
      })
      var len = this.data.recycleInfor.length
      var putInStorage={}
      putInStorage.recycleno=this.data.recycleno
      putInStorage.notSameReason=e.detail.value['notSameReason']
      putInStorage.mainInfo=[]
      for(var i=0;i<len;i++){
        var eachObj={}
        eachObj.kind=e.detail.value['kind'+i]
        eachObj.recycleAmount=e.detail.value['recycleAmount'+i]
        eachObj.recycleWeight=e.detail.value['recycleWeight'+i]
        putInStorage.mainInfo.push(eachObj)
      }
      
      if (putInStorage.mainInfo.length<=0){
        var tempZero = {}
        tempZero.kind = 0
        tempZero.recycleAmount = 0
        tempZero.recycleWeight = 0
        putInStorage.mainInfo.push(tempZero)
      }
      console.log(putInStorage)
      wx.request({
        url: h.main+'/main/listByruku.html',
        data: {
          putInStorage:putInStorage,
          saccountno:app.globalData.accountName,
          sessionid: app.globalData.sessionid
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }, 
        success:(res)=>{
          switch(res.data)
                {
                case 8:
                wx.showModal({    
                    title:'提示',    
                    content: '您目前的账户在另外登录!',  
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {
                            wx.navigateTo({
                              url: '../../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                // success
          console.log(res.data)
          if(res.data==1){
                    this.setData({
                      loadingHidden:true,
                    })
                    wx.showToast({
                    title: '入库成功',
                    duration: 500
                    });
                    // 等待半秒，toast消失后返回上一页
                    setTimeout(()=> {
                      // 若为search页面过来的
                      if(this.data.type==1){     
                        var pages = getCurrentPages();
                        if(pages.length > 1){
                            var prePage=pages[pages.length - 2];
                            prePage.putInStorageBack(this.data.recycleno)
                        }
                      }
                        wx.navigateBack();
                    }, 500);
                    this.setData({
                      canDo: false
                    })
                    }
                }
          
        },
        fail: (res)=>{
        },
        complete: (res)=>{
        }
      })
    

  },
      
})