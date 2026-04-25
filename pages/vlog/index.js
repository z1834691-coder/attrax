Page({
  data: {
    ids: [],
    loading: false,
    done: false,
    progress: 0,
  },

  onLoad(q) {
    const ids = (q.ids || "").split(",").filter(Boolean);
    this.setData({ ids });
  },

  onGen() {
    if (this.data.loading || this.data.done) return;
    this.setData({ loading: true, progress: 0 });
    const tick = () => {
      const p = this.data.progress + 15;
      if (p >= 100) {
        this.setData({ progress: 100, loading: false, done: true });
        wx.showToast({ title: "Demo 完成", icon: "success" });
        return;
      }
      this.setData({ progress: p });
      setTimeout(tick, 200);
    };
    setTimeout(tick, 200);
  },
});
