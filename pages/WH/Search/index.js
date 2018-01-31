import utils from '../../../utils/util.js'
import h from '../../../utils/url.js'
var app = getApp()
Page({
  data: {
    // dateS: '',
    dateE: '',
    date:'',
    result:[],
    se_name:'',
    loadingHidden:true
  },
  onLoad: function(options) {
     

  },
  onShow: function(){
        // 页面初始时间
        var dateNow = new Date()
        // var preDate = new Date(dateNow.getTime() - 86400000)
        this.setData({
            dateE:utils.formatTimeSimple(dateNow),
            date:utils.formatTimeSimple(dateNow),
        })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindDateEChange: function(e) {
    this.setData({
      dateE: e.detail.value
    })
  },
  changeNmae: function(e) {
    this.setData({
      se_name: e.detail.value
    })
  },
  // 查询
  search: function() {
    if(!this.data.se_name){
        wx.showModal({    
                    title:'提示',    
                    content: '物流商名称不能为空!',      
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {      
                        }    
                    }    
                });    
                return false;
    }
    this.setData({
      loadingHidden:false
    })
    wx.request({
      url: h.main+'/page/listbygroup11.html',
      data: {
          laccountno:this.data.se_name.trim(),
          recycletime:this.data.date,
          sessionid: app.globalData.sessionid
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
      success: (res)=>{
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
        if(parseInt(res.data)==0){
          console.log('0-名字错误-----')
          wx.showModal({    
                    title:'提示',    
                    content: '不存在该物流商!',      
                    showCancel: false,    
                    success: (res)=> {    
                        if (res.confirm) {
                          this.setData({
                            result:[]
                          })      
                        }    
                    }    
                }); 
        }else{
          console.log('其他-----')
          switch(res.data.length)
          {
          case 0:
            console.log('空的-----')
            wx.showModal({    
                    title:'提示',    
                    content: '所选时间内此物流商的回单都已入库!',      
                    showCancel: false,    
                    success: (res)=> {  
                        if (res.confirm) {
                          this.setData({
                            result:[]
                          })      
                        }    
                    }    
                }); 
            break;
          default:
            console.log('有记录-----')
            var arrayList = res.data
            var temptArray=[]
            while(arrayList.length>0){
              var tempt = arrayList.splice(0,3)
              var obj = {'number':tempt[0],'done':tempt[1],'total':tempt[2]}
              temptArray.push(obj)
            }
            this.setData({
              result:temptArray
            })
          }
        }
                }
        
      },
      fail: (res)=>{
        // fail
      },
      complete: (res)=>{
        this.setData({
          loadingHidden:true
        })
      }
    })
  },
  // 去入库
  goPutInStorage: function(e){
    var num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '../OrderList/index?id=' + num,
    })
    // var idx = e.currentTarget.dataset.index
    // var done = this.data.result[idx].done
    // var total = this.data.result[idx].total
    // if(done<total){
    //   wx.showModal({    
    //                 title:'提示',    
    //                 content: '该回单未完成不能入库!',      
    //                 showCancel: false,    
    //                 success: (res)=> {  
    //                     if (res.confirm) {      
    //                     }    
    //                 }    
    //             });
    // }else{
    //   wx.navigateTo({
    //     url: '../putInStorage/index?recycleno='+this.data.result[idx].number+'&type=1'
    //   })
    // }
  },
  // 下拉
  onPullDownRefresh(){
    // console.log('onPullDownRefresh----')
    // this.search()
  },
  // 入库后返回刷新效果
  putInStorageBack: function(info){
    console.log('info-------'+info)
    var tempResult = this.data.result
    console.log(tempResult)
    tempResult.map(function(item,index){
      console.log(item)
      if(item.number==info){
        tempResult.splice(index,1)
      }
    })
    this.setData({
      result:tempResult
    })

  }
})