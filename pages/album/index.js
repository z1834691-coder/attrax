const { getSession } = require("../../utils/store.js");
const { fetchCards, fetchQuota, getTodayCards } = require("../../utils/api.js");
const { groupByMonth, RAW_CARDS } = require("../../utils/mockData.js");

Page({
  data: {
    nickname: "旅人",
    total: 0,
    displayGroups: [],
    todayCards: [],
    quota: null,
    filters: [
      { id: "all", label: "全部" },
      { id: "favorite", label: "收藏" },
      { id: "city", label: "城市" },
      { id: "emotion", label: "情绪" },
      { id: "scent", label: "香调" },
    ],
    filterId: "all",
    monthCollapsed: {},
    selectMode: false,
    selectedIds: [],
  },

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
    this.setData({
      nickname: s.userInfo?.nickName || s.userInfo?.nickname || "旅人",
    });
    try {
      const f = wx.getStorageSync("attrax_album_filter");
      if (f) {
        wx.removeStorageSync("attrax_album_filter");
        this.setData({ filterId: f });
      }
    } catch (e) {}
    this.load();
  },

  onPullDownRefresh() {
    this.load().then(() => wx.stopPullDownRefresh());
  },

  getFilteredList() {
    let list = [...RAW_CARDS].sort(
      (a, b) => new Date(b.captured_at) - new Date(a.captured_at)
    );
    if (this.data.filterId === "favorite") {
      list = list.filter((c) => c.is_favorite);
    }
    if (["city", "emotion", "scent"].indexOf(this.data.filterId) >= 0) {
      wx.showToast({ title: "完整筛选将在正式版提供", icon: "none" });
    }
    return list;
  },

  buildDisplayGroups(groupRows) {
    const { monthCollapsed } = this.data;
    return groupRows.map((g, gi) => {
      const y = g.year_month.slice(0, 4);
      const m = g.year_month.slice(5, 7);
      const yearLabel = y + " 年 " + Number(m) + " 月";
      const cards = (g.cards || []).map((c, i) => ({
        ...c,
        _delay: gi * 60 + i * 40,
      }));
      return {
        ...g,
        yearLabel,
        count: g.count,
        cards,
        collapsed: !!monthCollapsed[g.year_month],
      };
    });
  },

  async load() {
    const cardsRes = await fetchCards();
    const quota = await fetchQuota();
    const list = this.getFilteredList();
    const gr = groupByMonth(list);
    this.setData({
      total: cardsRes.total,
      displayGroups: this.buildDisplayGroups(gr),
      todayCards: getTodayCards(),
      quota,
    });
  },

  onFilter(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ filterId: id });
    this.load();
  },

  onToggleMonth(e) {
    const ym = e.currentTarget.dataset.ym;
    const mc = {
      ...this.data.monthCollapsed,
      [ym]: !this.data.monthCollapsed[ym],
    };
    this.setData({ monthCollapsed: mc });
    const gr = groupByMonth(this.getFilteredList());
    this.setData({ displayGroups: this.buildDisplayGroups(gr) });
  },

  onCardTap(e) {
    const card = e.detail && e.detail.card;
    if (!card) return;
    if (this.data.selectMode) {
      this.toggleSelectById(card.card_id);
      return;
    }
    wx.navigateTo({
      url: `/pages/card/detail?id=${card.card_id}`,
    });
  },

  onOpenCard(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/card/detail?id=${id}` });
  },

  onLongSelect(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    if (!this.data.selectMode) {
      this.setData({ selectMode: true, selectedIds: [id] });
    } else {
      this.toggleSelectById(id);
    }
  },

  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    this.toggleSelectById(id);
  },

  toggleSelectById(id) {
    const arr = this.data.selectedIds.slice();
    const i = arr.indexOf(id);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(id);
    this.setData({ selectedIds: arr });
  },

  exitSelect() {
    this.setData({ selectMode: false, selectedIds: [] });
  },

  goVlog() {
    if (this.data.selectedIds.length < 3) {
      wx.showToast({ title: "请选 3–30 张卡片", icon: "none" });
      return;
    }
    wx.navigateTo({
      url: `/pages/vlog/index?ids=${this.data.selectedIds.join(",")}`,
    });
  },
});
