const { getSession, setSession } = require("../../utils/store.js");

Page({
  data: {
    activeTab: 0,
    bindCode: "",
    loading: false,
    justBound: false,
  },

  onLoad() {
    const s = getSession();
    if (!s.openid) {
      wx.redirectTo({ url: "/pages/auth/login" });
      return;
    }
    if (s.deviceId) {
      wx.switchTab({ url: "/pages/album/index" });
    }
  },

  onTab(e) {
    this.setData({ activeTab: Number(e.currentTarget.dataset.i) });
  },

  onCodeInput(e) {
    this.setData({ bindCode: (e.detail.value || "").slice(0, 6) });
  },

  finishBind() {
    const id = "device_demo_1";
    setSession({ deviceId: id, bind_at: new Date().toISOString() });
    getApp().applySession({ deviceId: id });
    this.setData({ justBound: true, loading: false });
    wx.showToast({ title: "绑定成功", icon: "success" });
    setTimeout(() => {
      wx.switchTab({ url: "/pages/album/index" });
    }, 800);
  },

  onMockScan() {
    this.setData({ loading: true });
    setTimeout(() => this.finishBind(), 500);
  },

  onSubmitCode() {
    if (this.data.bindCode.length < 6) return;
    this.setData({ loading: true });
    setTimeout(() => this.finishBind(), 500);
  },

  onMockBle() {
    this.setData({ loading: true });
    setTimeout(() => this.finishBind(), 500);
  },
});
