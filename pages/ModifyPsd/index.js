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
    // var that = this
    this.setData({
      accountName:app.globalData.accountName,
    });
    // console.log('---------');
    // console.log(app.globalData.userInfo);
  },
  //改变border颜色
  changeBorderColor1:function(){
      const ifChange = !this.data.change1
      this.setData({
        change1:ifChange
    });
  },
  //改变border颜色
  changeBorderColor2:function(){
      const ifChange = !this.data.change2
      this.setData({
        change2:ifChange
    });
  },
  //改变border颜色
    changeBorderColor3:function(){
      const ifChange = !this.data.change3
      this.setData({
        change3:ifChange
    });
  },
  //恢复border颜色
  noamrlBorderColor1:function(){
      const ifChange = !this.data.change1
      this.setData({
        change1:ifChange
    });
  },
  //恢复border颜色
  noamrlBorderColor2:function(){
      const ifChange = !this.data.change2
      this.setData({
        change2:ifChange
    });
  },
  //恢复border颜色
  noamrlBorderColor3:function(){
      const ifChange = !this.data.change3
      this.setData({
        change3:ifChange
    });
  },
  //第一次密码
  newPsdFn:function(e){
      const newPassword = e.detail.value
      this.setData( {
        newPsd: newPassword
      })
  },
  //校验两次密码
  confirmPsdFn:function(e){
      const password = e.detail.value
      this.setData( {
        confirmPsd: password
      })
  },
  //用户名
    userInfo:function(e){
      const AccountName = e.detail.value
      this.setData( {
        accountName: AccountName
      })
  },
  //保存修改密码
  saveNewPsd:function(){
      const passwordOriginal=this.data.newPsd
      const passwordAgain=this.data.confirmPsd
      const name =this.data.accountName
     if(name===""||name===null){    
            wx.showModal({    
                    title:'提示',    
                    content: '用户名不能为空!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: (res)=> {     
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
                    success: (res)=> {  
                        if (res.confirm) {      
                        }    
                    }    
                });    
                return false;    
            }

        //密码格式
        // var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
        // if (!reg1.test(str)) {
        //     return false;
        // }
        var v=passwordOriginal.trim();
        if(v.length<6){
            wx.showModal({    
                    title:'提示',    
                    content: '密码必须包含数字和字母,不能有特殊字符，且长度至少为6!',                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });
            return false
        }
        if(/^\d+$/.test(v))
        {
            wx.showModal({    
                    title:'提示',    
                    content: '密码必须包含数字和字母,不能有特殊字符，且长度至少为6!',                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });
            return false
        }
        if(/^[a-z]+$/i.test(v))
        {
            wx.showModal({    
                    title:'提示',    
                    content: '密码必须包含数字和字母,不能有特殊字符，且长度至少为6!',                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });
            return false;
        }
        if(!/^[A-Za-z0-9]+$/.test(v))
        {
            wx.showModal({    
                    title:'提示',    
                    content: '密码必须包含数字和字母,不能有特殊字符，且长度至少为6!',                    showCancel: false,    
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
                sessionid: app.globalData.sessionid
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            success: (res)=> {
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
                              url: '../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
                console.log('修改密码返回---')
                  console.log(res.data)
                  if(res.data==2){
                    wx.showModal({    
                    title:'提示',    
                    content: '该用户名不存在!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {      
                        }    
                    }    
                });
                  }else{
                    wx.showToast({
                    title: '修改成功',
                    duration: 500
                    });
                    // 等待半秒，toast消失后返回上一页
                    setTimeout(function () {
                        wx.navigateTo({
                              url: '../Login/index'
                            }) 
                    }, 500);
                  }
                }
                   
            },
            fail: (res)=> { 
                // fail
            },
            complete: (res)=> { 
                // complete
            }
        }) 
  
  },
  
  
})