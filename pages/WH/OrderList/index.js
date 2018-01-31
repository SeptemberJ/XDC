
import h from '../../../utils/url.js'
var app = getApp()
Page({
  data: {
    seInfo:{"name":'物流商A',"orderAmount":3,"done":1},
    percentT:'',
    recycleList:[],
    loadingHidden:true,
    id:'',
    // recycleList: {
    //   'recycleNum': '007',
    //   'total':2,
    //    'orderList': {
    //    'finished': [
    //      { 'orderNum': '007-1', 'snumber': 22,'sweight':2},
    //      { 'orderNum': '007-3', 'snumber': 22, 'sweight': 2 }
    //    ],
    //    'unfinished': [
    //      { 'orderNum': '007-2', 'snumber': 42, 'sweight': 3 }
    //    ]
    //     }}
  },
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
      

  },
    onShow: function(){
      this.getData()
    },
  //编辑入库数量--finished
  FeditLnumber: function(e){
    let tepmFinished = this.data.finished
    let OIDX = e.currentTarget.dataset.oidx
    let IDX = e.currentTarget.dataset.idx
    console.log(OIDX + '===' + IDX)
    tepmFinished[OIDX].list[IDX].snumber = e.detail.value
    this.setData({
      finished: tepmFinished
    })
    console.log(this.data.finished)
  },
  //编辑入库重量--finished
  FeditLweight: function (e) {
    let tepmFinished = this.data.finished
    let OIDX = e.currentTarget.dataset.oidx
    let IDX = e.currentTarget.dataset.idx
    tepmFinished[OIDX].list[IDX].lweight = e.detail.value
    this.setData({
      finished: tepmFinished
    })
    console.log(this.data.finished)
  },
  //编辑入库数量--unfinished
  UFeditLnumber: function (e) {
    let tepmUFinished = this.data.unfinished
    let OIDX = e.currentTarget.dataset.Oidx
    let IDX = e.currentTarget.dataset.idx
    tepmUFinished[OIDX].list[IDX].snumber = e.detail.value
    this.setData({
      unfinished: tepmUFinished
    })
  },
   //编辑入库重量--unfinished
  UFeditSweight: function (e) {
    let tepmUFinished = this.data.unfinished
    let OIDX = e.currentTarget.dataset.Oidx
    let IDX = e.currentTarget.dataset.idx
    tepmUFinished[OIDX].list[IDX].lweight = e.detail.value
    this.setData({
      unfinished: tepmUFinished
    })
  },
  // 订单入库
    toPutInStorageByOrder: function(e){
      let INDEX = e.currentTarget.dataset.idx
      let finishedArray = this.data.finished
      let Rukunumber = 0
      let Rukuweight = 0
      finishedArray[INDEX].list.map((item,idx)=>{
        Rukunumber+= Number(item.snumber)
        Rukuweight += Number(item.lweight)
      })
      wx.showModal({
        title: '提示',
        content: '确定将该订单入库？',
        showCancel: true,
        success: (res)=> {
          if (res.confirm) {
            wx.request({
              url: h.main + '/main/orderruku.html',
              data: {
                orderno: e.currentTarget.dataset.num,
                detail: finishedArray[INDEX].list,
                rukunumber: Rukunumber,
                rukuweight: Rukuweight,
                sessionid: app.globalData.sessionid
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              success: (res) => {
                switch (res.data) {
                  case 8:
                    wx.showModal({
                      title: '提示',
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
                    var _this = this
                    if (res.data == 1) {
                      this.setData({
                        loadingHidden: true,
                      })
                      wx.showToast({
                        title: '入库成功!',
                        icon: 'success',
                        duration: 500
                      })
                      let temp = this.data.finished.slice(0)
                      temp.splice(e.currentTarget.dataset.index, 1)

                      this.setData({
                        finished: temp
                      })
                      console.log(e.currentTarget.dataset.index)

                    }
                }

              },
              fail: (res) => {
              },
              complete: (res) => {
              }
            })
            
          }
        }
      }); 

    },
    onPullDownRefresh() {
      this.getData()
    },
    getData: function(){
      wx.request({
        url: h.main + '/main/recyforord.html',
        data: {
          recycleno: this.data.id,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        success: (res) => {
          wx.stopPullDownRefresh()
          console.log('查看回单里订单列表 backInfo---')
          console.log(res.data)
          let finished = []
          let unfinished = []
          res.data.map(function (item, idx) {
            if (item.status == 3) {
              finished.push(item)
            } else {
              unfinished.push(item)
            }
          })
          this.setData({
            recycleNum: this.data.id,
            finished: finished,
            unfinished: unfinished
          })
          console.log(finished)
          console.log(unfinished)


        },
        fail: (res) => {
          // fail
        },
        complete: (res) => {
          // complete
        }
      }) 

    }

})