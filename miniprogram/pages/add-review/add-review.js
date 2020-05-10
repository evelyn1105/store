// pages/add-review/add-review.js
const util = require('../../utils/util')
const db = require('../../utils/db')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: {},
    reveiwContent: '',
    userInfo: null,
    previewImages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
      this.setProduct(options)
    }).catch(err => {
      console.log('Not Authenticated yet')
    })
  },

  onInput(event) {
    this.setData({
      reviewContent: event.detail.value.trim()
    })
  },

  setProduct(options) {
    let product = {
      productId: options.productId,
      name: options.name,
      price: options.price,
      image: options.image
    }
    this.setData({
      product,
    })
  },

  addReview(event) {
    let content = this.data.reviewContent
    if (!content) return

    wx.showLoading({
      title: 'Submiting...'
    })

    this.uploadImage(images => {
      db.addReview({
        username: this.data.userInfo.nickName,
        avatar: this.data.userInfo.avatarUrl,
        content,
        productId: this.data.product.productId,
        images,
      }).then(result => {
        wx.hideLoading()

        const data = result.result

        if (data) {
          wx.showToast({
            title: 'Succeed'
          })

          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }).catch(err => {
        console.error(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: 'Failed'
        })
      })
    })
  },

  chooseImage() {
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          previewImages: res.tempFilePaths
        })
      }
    })
  },

  previewImage(event) {
    const target = event.currentTarget
    const src = target.dataset.src

    wx.previewImage({
      current: src,
      urls: [src]
    })
  },

  uploadImage(callback) {
    const previewImages = this.data.previewImages
    const images = []

    if (previewImages.length) {
      let imageCount = previewImages.length
      for (let i = 0; i < imageCount; i++) {
        db.uploadImage(previewImages[i]).then(result => {
          images.push(result.fileID)
          if (i === imageCount - 1) {
            callback && callback(images)
          }
        }).catch(err => {
          console.log('err', err)
        })
      }
    } else {
      callback && callback(images)
    }
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