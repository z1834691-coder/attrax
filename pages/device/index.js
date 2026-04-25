const { getSession } = require("../../utils/store.js");
const { fetchDeviceStatus } = require("../../utils/api.js");
const { RAW_CARDS } = require("../../utils/mockData.js");

Page({
  data: { st: null, lastSeen: "—", monthlyCards: 0 },

  onShow() {
    const s = getSession();
    if (!s.openid) {
      wx.redirectTo({ url: "/pages/auth/login" });
      return;
    }
    if (!s.deviceId) {
      wx.redirectTo({ url: "/pages/auth/bind" });
      return;
    }
    this.load(s.deviceId);
  },

  async load(deviceId) {
    const st = await fetchDeviceStatus(deviceId);
    const now = new Date();
    const ym = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    const count = RAW_CARDS.filter((c) => c.captured_at && c.captured_at.slice(0, 7) === ym)
      .length;
    this.setData({
      st,
      lastSeen: "刚刚",
      monthlyCards: count || 5,
    });
  },

  onMall() {
    wx.showToast({ title: "商城在订阅版中开放", icon: "none" });
  },
});
