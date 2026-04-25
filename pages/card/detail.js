const { fetchCardById, postFavorite, postDeviceReplay, postShareQr } = require("../../utils/api.js");
const { getSession } = require("../../utils/store.js");

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n) => (n < 10 ? "0" + n : "" + n);
  return (
    d.getFullYear() +
    "-" +
    p(d.getMonth() + 1) +
    "-" +
    p(d.getDate()) +
    "  " +
    p(d.getHours()) +
    ":" +
    p(d.getMinutes())
  );
}

function buildRows(recipe) {
  if (!recipe) return [];
  const rows = [];
  if (recipe.top && recipe.top.length) {
    const x = recipe.top[0];
    rows.push({
      label: "前调",
      name: x.name,
      pct: Math.round((x.ratio || 0) * 100),
      ratioText: (Math.round((x.ratio || 0) * 100)) + "%",
      color: x.color || "#F4C95D",
    });
  }
  if (recipe.heart && recipe.heart.length) {
    const x = recipe.heart[0];
    rows.push({
      label: "中调",
      name: x.name,
      pct: Math.round((x.ratio || 0) * 100),
      ratioText: (Math.round((x.ratio || 0) * 100)) + "%",
      color: x.color || "#E8A8A8",
    });
  }
  if (recipe.base && recipe.base.length) {
    const x = recipe.base[0];
    rows.push({
      label: "后调",
      name: x.name,
      pct: Math.round((x.ratio || 0) * 100),
      ratioText: (Math.round((x.ratio || 0) * 100)) + "%",
      color: x.color || "#8B6F47",
    });
  }
  return rows;
}

Page({
  data: {
    card: null,
    loading: true,
    timeStr: "",
    recipeRows: [],
    videoError: false,
    replaying: false,
  },

  _replayTimer: 0,
  _replayStart: 0,

  onLoad(q) {
    this._id = q.id || "";
    this.load();
    try {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
    } catch (e) {}
  },

  onReady() {
    this.videoCtx = wx.createVideoContext("lv", this);
    this._isPaused = false;
  },

  onShareAppMessage() {
    const c = this.data.card;
    if (!c) return { title: "自驾气味相册" };
    return {
      title: c.scent_title + " — 自驾气味相册",
      path: "/pages/card/share?share_token=demo_token_" + c.card_id,
      imageUrl: c.live_video_cover,
    };
  },

  onShareTimeline() {
    const c = this.data.card;
    if (!c) return {};
    return {
      title: c.scent_title,
      query: "id=" + c.card_id,
      imageUrl: c.live_video_cover,
    };
  },

  async load() {
    this.setData({ loading: true });
    const c = await fetchCardById(this._id);
    if (!c) {
      this.setData({ card: null, loading: false });
      return;
    }
    this.setData({
      card: c,
      loading: false,
      timeStr: formatTime(c.captured_at),
      recipeRows: buildRows(c.recipe),
    });
  },

  toggleVideo() {
    if (this.data.videoError) return;
    if (!this.videoCtx) {
      this.videoCtx = wx.createVideoContext("lv", this);
    }
    this._isPaused = !this._isPaused;
    if (this._isPaused) {
      this.videoCtx.pause();
    } else {
      this.videoCtx.play();
    }
  },

  onVideoErr() {
    this.setData({ videoError: true });
  },

  onEditNote() {
    wx.showModal({
      title: "备注",
      content: "演示版不保存到云端",
      showCancel: false,
    });
  },

  async onFav() {
    const c = this.data.card;
    if (!c) return;
    const next = !c.is_favorite;
    await postFavorite(c.card_id, next);
    this.setData({ "card.is_favorite": next });
  },

  onReplayStart() {
    this._replayStart = Date.now();
  },

  onReplayEnd() {
    const t = Date.now() - (this._replayStart || 0);
    if (t >= 1200) {
      this.runReplay();
    }
  },

  async runReplay() {
    const s = getSession();
    const c = this.data.card;
    if (!c) return;
    if (!s.deviceId) {
      wx.showModal({ title: "未绑定设备", content: "请先在「设备」中完成绑定" });
      return;
    }
    this.setData({ replaying: true });
    const res = await postDeviceReplay(s.deviceId, {
      card_id: c.card_id,
      recipe: c.recipe,
      trigger_source: "wechat_miniapp",
    });
    this.setData({ replaying: false });
    if (res.err) {
      wx.showModal({ title: "无法复现", content: res.message, showCancel: false });
      return;
    }
    try {
      wx.vibrateShort({ type: "medium" });
    } catch (e) {}
    wx.showToast({ title: "已下发车载复现", icon: "success" });
  },

  onQr() {
    const c = this.data.card;
    if (!c) return;
    postShareQr(c.card_id).then((d) => {
      wx.showModal({
        title: "配方码（演示）",
        content:
          "scene: " + d.scene_path + "\n" + "实际环境将展示小程序码图片，见 PRD 5.3.4",
        showCancel: false,
      });
    });
  },

  onDrawShare() {
    const c = this.data.card;
    if (!c) return;
    const query = wx.createSelectorQuery().in(this);
    query
      .select("#shareCanvas")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          wx.showToast({ title: "Canvas 未就绪", icon: "none" });
          return;
        }
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");
        const dpr = wx.getSystemInfoSync().pixelRatio || 1;
        const w = 600;
        const h = 750;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        const drawWithImg = (img) => {
          const ih = 420;
          ctx.drawImage(img, 0, 0, w, ih);
          ctx.fillStyle = "#111";
          ctx.font = "22px system-ui, sans-serif";
          ctx.fillText(c.location_name || "", 32, ih + 40);
          ctx.fillStyle = "#666";
          ctx.font = "16px system-ui, sans-serif";
          ctx.fillText(this.data.timeStr, 32, ih + 68);
          ctx.fillStyle = "#111";
          ctx.font = "bold 20px system-ui, sans-serif";
          const title = (c.scent_title || "").slice(0, 20);
          ctx.fillText("「" + title + "」", 32, ih + 110);
          const yb = ih + 150;
          const parts = c.recipe
            ? [c.recipe.top, c.recipe.heart, c.recipe.base]
            : [];
          parts.forEach((row, i) => {
            if (row && row[0]) {
              const t = row[0];
              ctx.fillStyle = t.color || "#999";
              ctx.fillRect(32, yb + i * 26, 200 * (t.ratio || 0.3), 14);
              ctx.fillStyle = "#333";
              ctx.font = "14px system-ui, sans-serif";
              ctx.fillText(
                t.name + "  " + Math.round((t.ratio || 0) * 100) + "%",
                250,
                yb + i * 26 + 12
              );
            }
          });
          ctx.fillStyle = "#999";
          ctx.font = "12px system-ui, sans-serif";
          ctx.fillText("自驾气味相册", 32, h - 40);
          wx.canvasToTempFilePath(
            {
              canvas,
              success: (r) => {
                wx.saveImageToPhotosAlbum({
                  filePath: r.tempFilePath,
                  success: () =>
                    wx.showModal({
                      title: "已保存到相册",
                      content: "可长按图片发送到朋友圈",
                      showCancel: false,
                    }),
                  fail: () =>
                    wx.showToast({ title: "保存失败，请开相册权限", icon: "none" }),
                });
              },
              fail: () => wx.showToast({ title: "导出失败", icon: "none" }),
            },
            this
          );
        };
        const img = canvas.createImage();
        img.crossOrigin = "anonymous";
        img.onload = () => drawWithImg(img);
        img.onerror = () => {
          ctx.fillStyle = "#eee";
          ctx.fillRect(0, 0, w, 420);
          ctx.fillStyle = "#333";
          ctx.fillText("封面加载失败", 32, 200);
        };
        wx.getImageInfo({
          src: c.live_video_cover,
          success: (r) => {
            img.src = r.path;
          },
          fail: () => {
            img.src = c.live_video_cover;
          },
        });
      });
  },
});
