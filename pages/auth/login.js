const { getSession, setSession } = require("../../utils/store.js");
const { mockWxLogin } = require("../../utils/api.js");

Page({
  data: { loading: false },

  onLoad() {
    const s = getSession();
    if (s.openid) {
      if (!s.deviceId) {
        wx.redirectTo({ url: "/pages/auth/bind" });
      } else {
        wx.switchTab({ url: "/pages/album/index" });
      }
    }
  },

  async onTapLoginWithProfile() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const login = await new Promise((resolve, reject) => {
        wx.login({ success: resolve, fail: reject });
      });
      let userInfo = { nickName: "旅人", avatarUrl: "" };
      try {
        const prof = await new Promise((resolve, reject) => {
          wx.getUserProfile({
            desc: "用于个人主页与分享展示",
            success: resolve,
            fail: reject,
          });
        });
        userInfo = prof.userInfo;
      } catch (e) {
        // 用户拒绝授权时使用默认昵称
      }
      const res = await mockWxLogin(login.code);
      setSession({
        openid: res.openid,
        token: res.session_token,
        userInfo,
      });
      getApp().applySession({
        openid: res.openid,
        userInfo,
      });
      wx.redirectTo({ url: "/pages/auth/bind" });
    } catch (e) {
      wx.showToast({ title: "登录失败，请重试", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },
});
