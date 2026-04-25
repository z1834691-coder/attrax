const { getCardById } = require("../../utils/mockData.js");
const { getSession } = require("../../utils/store.js");
const { postDeviceReplay } = require("../../utils/api.js");

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

Page({
  data: {
    card: null,
    timeStr: "",
    dots: ["#F4C95D", "#E8A8A8", "#8B6F47"],
    fromUser: "小李",
    hasDevice: false,
  },

  onLoad(q) {
    const token = q.share_token || "";
    const idMatch = token.replace("demo_token_", "");
    const c = getCardById(idMatch) || getCardById("card_20260424_a8f3");
    if (c) {
      const r = c.recipe;
      const dots = [r?.top?.[0]?.color, r?.heart?.[0]?.color, r?.base?.[0]?.color].filter(
        Boolean
      );
      this.setData({
        card: c,
        timeStr: formatTime(c.captured_at),
        dots: dots.length ? dots : this.data.dots,
        hasDevice: !!getSession().deviceId,
      });
    }
  },

  onReplaySelf() {
    const c = this.data.card;
    const s = getSession();
    if (!c || !s.deviceId) {
      wx.showModal({ title: "提示", content: "请先绑定设备" });
      return;
    }
    postDeviceReplay(s.deviceId, {
      card_id: c.card_id,
      recipe: c.recipe,
      trigger_source: "wechat_miniapp",
      share_token: "from_share_page",
    }).then((res) => {
      if (res.err) {
        wx.showModal({ title: "无法复现", content: res.message, showCancel: false });
        return;
      }
      wx.showToast({ title: "已请求复现", icon: "success" });
    });
  },

  onWant() {
    wx.showModal({
      title: "想要同款",
      content: "正式版将跳转产品介绍与预约页（黑客松为演示）",
      showCancel: false,
    });
  },
});
