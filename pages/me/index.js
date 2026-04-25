const { getSession, clearSession } = require("../../utils/store.js");
const { RAW_CARDS } = require("../../utils/mockData.js");

Page({
  data: {
    s: {},
    joinDays: 1,
    cardCount: 0,
  },

  onShow() {
    const s = getSession();
    this.setData({
      s: {
        openid: s.openid,
        userInfo: s.userInfo || { nickName: "旅人", avatarUrl: "" },
      },
      cardCount: RAW_CARDS.length,
      joinDays: 42,
    });
  },

  goFav() {
    try {
      wx.setStorageSync("attrax_album_filter", "favorite");
    } catch (e) {}
    wx.switchTab({ url: "/pages/album/index" });
  },

  noop() {
    wx.showToast({ title: "一期迭代", icon: "none" });
  },

  goLogin() {
    wx.redirectTo({ url: "/pages/auth/login" });
  },

  logout() {
    clearSession();
    getApp().logout();
    wx.redirectTo({ url: "/pages/auth/login" });
  },
});
