const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page( {
  data: {
    userInfo: {},
    change1:false,
    change2:false,
    change3:false,
    username:'',
    psd:'',
    newPsd:'',
    confirmPsd:'',
    accountName:''
  },

  onLoad: function() {

   
  },
  changeBorderColor1:function(){
      const ifChange = !this.data.change1
      this.setData({
        change1:ifChange
    });
  },
  changeBorderColor2:function(){
      const ifChange = !this.data.change2
      this.setData({
        change2:ifChange
    });
  },
    changeBorderColor3:function(){
      const ifChange = !this.data.change3
      this.setData({
        change3:ifChange
    });
  },
  noamrlBorderColor1:function(){
      const ifChange = !this.data.change1
      this.setData({
        change1:ifChange
    });
  },
  noamrlBorderColor2:function(){
      const ifChange = !this.data.change2
      this.setData({
        change2:ifChange
    });
  },
  noamrlBorderColor3:function(){
      const ifChange = !this.data.change3
      this.setData({
        change3:ifChange
    });
  },
  newPsdFn:function(e){
      const newPassword = e.detail.value
      this.setData( {
        newPsd: newPassword
      })
  },
  confirmPsdFn:function(e){
      const password = e.detail.value
      this.setData( {
        confirmPsd: password
      })
  },
    userInfo:function(e){
      const AccountName = e.detail.value
      this.setData( {
        accountName: AccountName
      })
  },
  sign:function(){
      const passwordOriginal=this.data.newPsd
      const passwordAgain=this.data.confirmPsd
      const name =this.data.accountName
     if(name===""||name===null){    
            wx.showModal({    
                    title:'提示',    
                    content: '用户名不能为空!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });    
                return false;    
            }
      if(passwordOriginal===""||passwordOriginal===null){    
            wx.showModal({    
                    title:'提示',    
                    content: '密码不能为空!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });    
                return false;    
            }
        if(passwordOriginal!=passwordAgain){    
            wx.showModal({    
                    title:'提示',    
                    content: '两次密码不一致!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });    
                return false;    
            }
            
        wx.request({
            url: h.main+'/main/uppass.html',
            data: {
                password:passwordOriginal,
                saccountno:name,
                // oppen_id: app.globalData.oppenid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',

            },
            success: function (res) {
                  console.log('修改密码返回---')
                  console.log(res.data)
                  if(res.data==2){
                    wx.showModal({    
                    title:'提示',    
                    content: '该用户名不存在!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });
                  }else{
                      wx.showToast({
                    title: '注册成功',
                    duration: 500
                    });
                    // 等待半秒，toast消失后返回上一页
                    setTimeout(function () {
                        wx.navigateBack();
                    }, 500);
                  }
                   
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        }) 
  
  },
  
  
})