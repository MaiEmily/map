// pages/map/map.js
const app = getApp();
// 引用百度地图微信小程序JSAPI模块
const BMap = require('../../libs/bmap-wx.min.js');
var bmap;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchCon:'',//输入内容
    searchResult:[],//搜索列表

    longitude:'',//经度
    latitude:'',//纬度
    address: '',
    scale: 16,//地图的扩大倍数
    markers: [{ //标记点用于在地图上显示标记的位置
      id: 1,
      latitude: '',
      longitude: '',
      iconPath: '../../../../public/image/location.png',
      width: 1,
      height: 1,
      // callout: {
      //   content: '自定义点',
      //   color: '#fff',
      //   bgColor: '#66DFB4',
      //   fontSize: '16',
      //   borderRadius: '5',
      //   padding: '20'
      // }
    }],
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    const that = this;

    // 实例化百度地图API核心类
    bmap = new BMap.BMapWX({
      ak: app.globalData.ak
    })

    //获取当前位置经纬度
    app.getLocation(function (location) {
      console.log(location);
      var str = 'markers[0].longitude', str2 = 'markers[0].latitude';
      that.setData({
        longitude: location.longitude,
        latitude: location.latitude,
        [str]: location.longitude,
        [str2]: location.latitude,
      })
    })
  },
  // 绑定input输入 --搜索
  bindKeyInput(e){
    var that = this; 
    var fail = function (data) { //请求失败
      console.log(data) 
    };
    var success = function (data) { //请求成功
      var searchResult =[];
      for(var i=0;i<data.result.length;i++){ //搜索列表只显示10条
        if(i>10){ 
          return;
        }
        if (data.result[i].location){
          searchResult.push(data.result[i]);
        }
      }
      that.setData({
        searchResult: searchResult
      });
    }
    // 发起suggestion检索请求 --模糊查询
    bmap.suggestion({
      query: e.detail.value,
      city_limit: false,
      fail: fail,
      success: success
    });
  },
  // 点击搜索列表某一项
  tapSearchResult(e){
    var that = this;
    var value=e.currentTarget.dataset.value;
    var str = 'markers[0].longitude', str2 = 'markers[0].latitude';
    that.setData({
      longitude: value.location.lng,
      latitude: value.location.lat,
      searchResult:[],
      searchCon: value.name,
      address: value.province+value.city + value.district+value.name,
      [str]: value.location.lng,
      [str2]: value.location.lat,
    })
  },
  // markets
  getLngLat(){
    var that = this; 
    this.mapCtx = wx.createMapContext("myMap"); 
    var latitude, longitude;
    this.mapCtx.getCenterLocation({ 
      success: function (res) { 
        latitude = res.latitude;
        longitude = res.longitude;
        var str = 'markers[0].longitude', str2 = 'markers[0].latitude';
        that.setData({ 
          longitude: res.longitude, 
          latitude: res.latitude, 
          [str]: res.longitude,
          [str2]: res.latitude,
        })
        that.regeocoding(); //根据经纬度-》解析地址名称 
      } 
    })

    //修改坐标位置 
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: latitude,
        longitude: longitude,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  //地图视野变化触发的事件
  regionchange(e) {
    console.log('hahahh')
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.getLngLat();
    }
  },
  markertap(e) {
    console.log(e.markerId)
    console.log(e);
  },
  controltap(e) {
    console.log(e.controlId)
  },

  // 发起regeocoding逆地址解析 -- 从经纬度转换为地址信息
  regeocoding(){
    const that = this;
    bmap.regeocoding({
      location:that.data.latitude+','+that.data.longitude,
      success: function(res){
        that.setData({
          address: res.wxMarkerData[0].address
        })
      },
      fail: function(res){
        that.tipsModal('请开启位置服务权限并重试!')
      },
      
    });
  },
  //提示
  tipsModal: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmColor: '#2FB385'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})