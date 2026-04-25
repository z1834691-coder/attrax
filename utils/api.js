const {
  RAW_CARDS,
  groupByMonth,
  getTodayCards,
  getCardById,
} = require("./mockData.js");
const { getSession } = require("./store.js");

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function ok(data) {
  return { code: 0, data, message: "ok" };
}

async function mockWxLogin(code) {
  await delay(200);
  return { openid: "openid_hackathon_demo", session_token: "mock_jwt_" + (code || "x") };
}

async function fetchUserMe() {
  await delay(120);
  const s = getSession();
  return {
    openid: s.openid || "openid_hackathon_demo",
    nickname: s.userInfo?.nickname || "旅人",
    avatar_url:
      s.userInfo?.avatarUrl ||
      "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42t2422hcYQjEeLg0W5lqhfglq7lQ/0",
  };
}

async function fetchQuota() {
  await delay(80);
  return {
    is_subscriber: false,
    card_quota: 50,
    card_used: RAW_CARDS.length,
    card_remaining: 50 - RAW_CARDS.length,
    archived_count: 0,
    next_archive_threshold: 50,
  };
}

async function fetchCards() {
  await delay(180);
  const list = [...RAW_CARDS].sort(
    (a, b) => new Date(b.captured_at) - new Date(a.captured_at)
  );
  return {
    total: list.length,
    groups: groupByMonth(list),
    list,
  };
}

async function fetchCardById(id) {
  await delay(100);
  const c = getCardById(id);
  if (!c) return null;
  return { ...c };
}

async function postFavorite(cardId, favor) {
  await delay(150);
  const c = getCardById(cardId);
  if (c) c.is_favorite = favor;
  return { card_id: cardId, is_favorite: favor };
}

async function postDeviceReplay(deviceId, body) {
  await delay(800 + Math.random() * 400);
  if (!deviceId) {
    return { err: 4001, message: "设备离线" };
  }
  const s = getSession();
  if (!s.deviceId) {
    return { err: 4001, message: "未绑定设备" };
  }
  if (s.deviceId !== deviceId) {
    return { err: 4003, message: "设备不匹配" };
  }
  return {
    task_id: "task_" + Date.now(),
    estimated_duration_sec: body.recipe?.total_duration_sec || 12,
    queue_position: 0,
  };
}

async function postShareQr(cardId) {
  await delay(200);
  return {
    qr_url: "",
    scene_path: `pages/card/share?share_token=demo_token_${cardId}`,
    share_token: "demo_token_" + cardId,
    expire_at: "2027-04-24T18:32:00.000Z",
  };
}

async function fetchDeviceStatus(deviceId) {
  await delay(120);
  return {
    device_id: deviceId,
    device_name: "我的小米SU7",
    online: true,
    last_seen: new Date().toISOString(),
    current_task: null,
    bottles: [
      {
        slot_id: 1,
        ingredient: "sandalwood",
        name: "檀香",
        remaining_pct: 65,
        warning: false,
        purchase_url: "/mall/sku/sandalwood",
      },
      {
        slot_id: 2,
        ingredient: "sea_salt",
        name: "海盐",
        remaining_pct: 28,
        warning: true,
        purchase_url: "/mall/sea_salt",
      },
      {
        slot_id: 3,
        ingredient: "lemongrass",
        name: "柠檬草",
        remaining_pct: 45,
        warning: false,
        purchase_url: "/mall/lemongrass",
      },
      {
        slot_id: 4,
        ingredient: "rose",
        name: "玫瑰",
        remaining_pct: 18,
        warning: true,
        purchase_url: "/mall/rose",
      },
    ],
    settings: {
      wake_words: ["哈奇米", "拍下这一刻"],
      intensity: "medium",
      quiet_hours: { start: "22:00", end: "07:00" },
      auto_spray: true,
    },
  };
}

module.exports = {
  mockWxLogin,
  fetchUserMe,
  fetchQuota,
  fetchCards,
  fetchCardById,
  postFavorite,
  postDeviceReplay,
  postShareQr,
  fetchDeviceStatus,
  getTodayCards: () => getTodayCards(RAW_CARDS),
  ok,
};
