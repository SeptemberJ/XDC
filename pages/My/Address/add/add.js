//  const AV = require('../../../../utils/av-weapp.js')
 import h from '../../../../utils/url.js'
 import ss from '../../../../utils/add.js'
 var app = getApp()
Page({
	isDefault: false,
	data: {
		address:{},
		objectId:-1,
		id:'',
		current: 0,
		province: [],
		city: [],
		region: [],
		town: [],
		provinceObjects: [],
		cityObjects: [],
		regionObjects: [],
		townObjects: [],
		areaSelectedStr: '请选择省市区',
		maskVisual: 'hidden',
		provinceName: '请选择'
	},
	onLoad: function (options) {
			var that = this;
			console.log(ss.add)
			var list = ss.add;
			var lista = [];
			for (var i in list) {
				lista.push(list[i].name)
			}
			this.setData({
				province: lista,
			})
			console.log(lista)
			if(options.id){
				wx.getStorage({
				key: 'address',
				success: (res)=>{
					var addr={}
					if(!res.data.province){
						addr={'id':res.data.id,'sblock':res.data.sblock,'realname':res.data.username,'mobile':res.data.smobile,'province':'','city':res.data.city,'region':res.data.region}
					}else{
						addr={'id':res.data.id,'sblock':res.data.sblock,'realname':res.data.username,'mobile':res.data.smobile,'province':res.data.province,'city':res.data.city,'region':res.data.region}
					}
					
					this.setData({
						id:res.data.id,
						areaSelectedStr:addr.province+addr.city+addr.region,
						address:addr,
						// provinceName:res.data.province,
						// cityName:res.data.city,
						// regionName:res.data.region
					})
					console.log('address stroge------')
			console.log(this.data.address)
				}
				
				})
			}
	},

	// 显示选项区域
	cascadePopup: function() {
		console.log('cascadePopup---')
		console.log(this.data.city)
		var animation = wx.createAnimation({
			duration: 500,
			timingFunction: 'ease-in-out',
		});
		this.animation = animation;
		animation.translateY(-285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'show'
		});
	},
	// 隐藏选项区域
	cascadeDismiss: function () {
		this.animation.translateY(285).step();
		this.setData({
			animationData: this.animation.export(),
			maskVisual: 'hidden'
		});
	},
	// 选择province
	provinceTapped: function (e) {
		console.log('provinceTapped----')
		// 标识当前点击省份，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		console.log(index)
		// current为1，使得页面向左滑动一页至市级列表
		// provinceIndex是市区数据的标识
		this.setData({
			provinceName: this.data.province[index],
			regionName: '',
			townName: '',
			provinceIndex: index,
			cityIndex: -1,
			regionIndex: -1,
			townIndex: -1,
			region: [],
			town: []
		});
		var that = this;
		var lista=[];
		var City=ss.add[index].city
		// var lista = ss.add[index].city[0].area;
		for (var i in City) {
				lista.push(City[i].name)
			}
		
		console.log(lista)
		that.setData({
			cityName: '请选择',
			city: lista,
			current: 1
			//cityObjects: area
		});
	},
	// 选择city
	cityTapped: function (e) {
		console.log('cityTapped----')
		// 标识当前点击县级，记录其名称与主键id都依赖它
		var index = e.currentTarget.dataset.index;
		// current为1，使得页面向左滑动一页至市级列表
		// cityIndex是市区数据的标识
		this.setData({
			cityIndex: index,
			regionIndex: -1,
			townIndex: -1,
			cityName: this.data.city[index],
			regionName: '',
			townName: '',
			town: []
		});
		this.setData({
				regionName: '请选择',
				region: ss.add[this.data.provinceIndex].city[this.data.cityIndex].area,
				current: 2
			});
			
	},
	// 选择region
	regionTapped: function(e) {
    	// 标识当前点击镇级，记录其名称与主键id都依赖它
    	var index = e.currentTarget.dataset.index;
    	// current为1，使得页面向左滑动一页至市级列表
    	// regionIndex是县级数据的标识
    	this.setData({
    		regionIndex: index,
    		townIndex: -1,
    		regionName: this.data.region[index],
    		townName: ''
    	});
		var areaSelectedStr = this.data.provinceName + this.data.cityName+this.data.regionName;
		this.setData({
			areaSelectedStr: areaSelectedStr
		});
		this.cascadeDismiss();
    },
    currentChanged: function (e) {
    	// swiper滚动使得current值被动变化，用于高亮标记
    	var current = e.detail.current;
    	this.setData({
    		current: current
    	});
    },
    changeCurrent: function (e) {
    	// 记录点击的标题所在的区级级别
    	var current = e.currentTarget.dataset.current;
    	this.setData({
    		current: current
    	});
    },

		// 提交
		formSubmit: function(e) {
		// detail
		var detail = e.detail.value.detail;
		// realname
		var realname = e.detail.value.realname;
		// mobile
		var mobile = e.detail.value.mobile;
		// 表单验证
		if (this.data.areaSelectedStr == '请选择省市区') {
			wx.showModal({    
                    title:'提示',    
                    content: '请选择区域!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                });    
                // return false;
			return;
		}
		if (detail == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请填写详细地址!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}
		if (realname == '') {
			wx.showModal({    
                    title:'提示',    
                    content: '请填写收件人!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}
		// 手机或固定电话 
		if(mobile.indexOf('-')>0){
			console.log('固定电话')

			var regexp=/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
		}else{
			console.log('手机')
			var regexp=/^1[34578]\d{9}$/
			
		}
		
		if(!(regexp.test(mobile))){
			wx.showModal({    
                    title:'提示',    
                    content: '请填写正确的联系电话!',    
                    confirmColor:'#000',    
                    showCancel: false,    
                    success: function (res) {    
                        if (res.confirm) {    
                            //console.log('用户点击确定')    
                        }    
                    }    
                }); 
			return;
		}

	console.log(this.data.address.id)

	if(this.data.address.id || this.data.address.id==0){
		console.log('修改-----')
		var addressObj={
			'username':e.detail.value.realname,
			'smobile': e.detail.value.mobile,
			'sblock':e.detail.value.detail,
			'province': this.data.provinceName,
			'city': this.data.cityName,
			'region': this.data.regionName,
			'id':this.data.address.id
		}
		wx.request({
				url: h.main + '/page/upuser1.html',
			data: {
				username: e.detail.value.realname,
				smobile: e.detail.value.mobile,
				sblock:e.detail.value.detail,
				province: this.data.provinceName=='请选择'?this.data.address.province:this.data.provinceName,
				city: this.data.cityName?this.data.cityName:this.data.address.city,
				region: this.data.regionName?this.data.regionName:this.data.address.region,
				town:'',
				saccountno:app.globalData.accountName,
				id:this.data.id,
				sessionid: app.globalData.sessionid
			},
			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			}, // 设置请求的 header
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
                              url: '../../../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
				console.log(res.data)
				wx.showToast({
					title: '保存成功',
					duration: 500
				});
				// 等待半秒，toast消失后返回上一页
				setTimeout(function () {
					wx.navigateBack();
				}, 500);
                }
				
			},
			fail: (res)=> {


			},
			complete: (res)=> {

			}
		})

	}else{
		console.log('新增-----')
		var addressObj={
			'username':e.detail.value.realname,
			'smobile': e.detail.value.mobile,
			'sblock':e.detail.value.detail,
			'province': this.data.provinceName,
			'city': this.data.cityName,
			'region': this.data.regionName,
		}
		console.log(addressObj)
			wx.request({
				url: h.main + '/page/upuser.html',
			data: {
				username: e.detail.value.realname,
				smobile: e.detail.value.mobile,
				sblock:e.detail.value.detail,
				// sarea: this.data.areaSelectedStr,
				province: this.data.provinceName,
				city: this.data.cityName,
				region: this.data.regionName,
				town:'',
				saccountno:app.globalData.accountName,
				sessionid: app.globalData.sessionid
			},
			method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
			header: {
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			}, // 设置请求的 header
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
                              url: '../../../Login/index'
                            })      
                        }    
                    }    
                }); 
                break;
                default:
				console.log(e.detail.value.realname)
				console.log(res.data)
				wx.showToast({
					title: '保存成功',
					duration: 500
				});
				//等待半秒，toast消失后返回上一页
				setTimeout(function () {
					wx.navigateBack();
				}, 500);
                }
				
			},
			fail: (res)=> {


			},
			complete: (res)=> {

			}
		})
		
	}
	}
    
})
