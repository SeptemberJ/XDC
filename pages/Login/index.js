const MD5 = require('../../utils/md5.js')
import h from '../../utils/url.js'
var util = require('../../utils/util')
var requestPromisified = util.wxPromisify(wx.request)
var app = getApp()
Page( {
  data: {
    userInfo: {},
    change:false,
    change2:false,
    username:'',
    psd:'',
    loadingHidden:true,
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //         //更新数据
    //         // console.log(userInfo);
    //         that.setData({
    //             userInfo: userInfo

    //         })
    //     })
    this.setData({
      userInfo:app.globalData.userInfo,
    });
    // console.log('---------');
    // console.log(app.globalData.userInfo);
  },
  //   focus时改变border-color
  changeBorderColor:function(){
      const ifChange = !this.data.change
      this.setData({
        change:ifChange
    });
  },
  //   focus时改变border-color
  changeBorderColor2:function(){
      const ifChange = !this.data.change2
      this.setData({
        change2:ifChange
    });
  },
  //   恢复border-color
  noamrlBorderColor:function(){
      const ifChange = !this.data.change
      this.setData({
        change:ifChange
    });
  },
  //   恢复border-color
  noamrlBorderColor2:function(){
      const ifChange = !this.data.change2
      this.setData({
        change2:ifChange
    });
  },
//   获取输入的姓名
  userInfo:function(e){
      const userName = e.detail.value
      this.setData( {
        username: userName
      })
  },
  psdInfo:function(e){
      const password = e.detail.value
      this.setData( {
        psd: password
      })
  },
  loginIn:function(){
      console.log("app.globalData.userRole----------")
      console.log(app.globalData.userRole)
      var userRoleH=''
      var that = this
      var USER=this.data.username
      if(USER===""||USER===null){    
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
      var PSD=this.data.psd   
        if(PSD===""||PSD===null){    
            wx.showModal({    
                    title:'提示',    
                    content: '密码不能为空!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                });    
                return false;    
            }else{    
                PSD=MD5.hexMD5(PSD);    
            }
            this.setData({
                    loadingHidden:false
            })
// 新的
            requestPromisified({
                url:  h.main+"/main/userlistBytype.html",
                data: {
                saccountno:USER,
                password:PSD,
                // oppen_id: app.globalData.oppenid
                },
                
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: {
                'content-type': 'application/x-www-form-urlencoded' ,
                    'Accept': 'application/json',
                    'Set-Cookie':'sessionToken='+app.globalData.session
                }, // 设置请求的 header
            }).then((res)=> {
                console.log('login backinfor----');
                console.log(res.data);
                this.setData({
                    loadingHidden:true
                })
                console.log(this.data.loadingHidden);
                app.globalData.accountName=USER;
                app.globalData.sessionid=res.data[1];
                //初次登录修改密码
                if(res.data[2]=="请修改密码"){
                    wx.showModal({    
                    title:'提示',    
                    content: '初次登录请修改密码!',  
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            wx.navigateTo({
                              url: '../ModifyPsd/index'
                            })    
                        }    
                    }    
                    });    
                    return false;
                }
                //供应商登录
                if(res.data[0]==1){
                    userRoleH=1
                    console.log('供应商登录promise=============')
                    console.log(userRoleH)
                    app.globalData.userRole=userRoleH
                    wx.switchTab({
                        url: '../Index/index'
                    })
                    //获取库存
                    var that = this
                    requestPromisified({
                        url: h.main+'/page/infaty.html',
                        data: {
                            saccountno:app.globalData.accountName,
                            sessionid: app.globalData.sessionid
                        },
                        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        header: {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json',
                        },

                    }).then((res)=>{
                        switch(res.data)
                        {
                        case 8:
                        wx.showModal({    
                            title:'提示',    
                            content: '对不起,当前的账户已被挤掉!', 
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
                        console.log('stock data--------')
                        console.log(res.data[0][0].inventory)
                        app.globalData.batteryStock=res.data[0][0].inventory
                        app.globalData.SPname = res.data[1]
                        }
                    }).catch((res)=> {
                        console.log(res)
                        this.setData({
                            loadingHidden:true
                        })
                        console.error("get Stock failed")
                    })

                }
                 //物流商登录
                 if(res.data[0]==2){
                    userRoleH=2
                console.log('物流商登录promise===============')
                    console.log(userRoleH)
                    app.globalData.userRole=userRoleH
                    wx.switchTab({
                        url: '../Index/index'
                    })
                }
                //仓库管理员登录
                if(res.data[0]==3){
                    userRoleH=3
                    console.log('仓库登录promise===============')
                    console.log(userRoleH)
                    app.globalData.userRole=userRoleH
                    wx.switchTab({
                        url: '../Index/index'
                    })
                }

                //登录失败
                if(res.data[0]==0){
                    wx.showModal({    
                    title:'提示',    
                    content: '用户名或密码错误!',    
                    confirmColor:'#118EDE',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                    });  
                                        
                }
            
            }).catch((res)=> {
                this.setData({
                    loadingHidden:true
                })
                wx.showToast({
				    title: '服务器繁忙，请稍后重试！'
                });
                console.error("get login failed")
            })

          
  },
  forgetpsd:function(){
      wx.navigateTo({
        url: '../ModifyPsd/index'
      })
  },
  toSign: function(){
      wx.navigateTo({
        url: '../sign/index'
      })
  }
  
})