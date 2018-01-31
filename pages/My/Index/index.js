var app = getApp()
Page( {
  data: {
    role:'',
    userInfo: {},
    accountName:'',
    loadingHidden:true
   
  },

  onLoad: function() {
    var that = this
    
    //调用应用实例的方法获取全局数据
    // app.getUserInfo( function( userInfo ) {
    //   //更新数据
    //   that.setData( {
    //     userInfo: userInfo
    //   })
    // })
  
    that.setData({
      role: app.globalData.userRole,
      userInfo:app.globalData.userInfo,
      accountName:app.globalData.accountName
    });
    console.log('---------');
    console.log(app.globalData.userInfo);
   
  },
  navigateToStock: function(){
    wx.navigateTo({
			url: '../Stock/index'
		});
  },
  navigateToApply: function(){
    wx.navigateTo({
			url: '../Apply/index'
		});
  },
  navigateToAddress: function(){
    wx.navigateTo({
			url: '../Address/list/list'
		});
  },
  navigateToPrice: function(){
    wx.navigateTo({
			url: '../Price/index'
		});
  },
  goModifyPass: function(){
    wx.navigateTo({
			url: '../../ModifyPsd/index'
		});
  },
//退出登录
  logout: function () {
    wx.showModal({
      title: '提示',
      content: '确定退出当前账号？',
      success: (res)=> {
        if (res.confirm) {
          wx.showToast({
            'title': '退出成功',
            duration: 500
          });
          setTimeout(function () {
            wx.navigateTo({
              url: '../../Login/index'
            });
          }, 500);
         
        }
      }
    }); 
	},
})