/**
 * 黑客松 Demo 种子数据 — 覆盖 PRD 5.2.4 字段
 * 媒体资源为 https；正式环境请替换为自有 OSS 并在「下载合法域名」中配置
 */

const VIDEO_DEMO =
  "https://lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4";

function card(over) {
  return {
    card_id: over.card_id,
    user_id: "openid_demo",
    device_id: "device_demo_1",
    live_video_url: over.live_video_url || VIDEO_DEMO,
    live_video_cover: over.live_video_cover,
    captured_at: over.captured_at,
    gps_lat: over.gps_lat,
    gps_lng: over.gps_lng,
    location_name: over.location_name,
    scene_tags: over.scene_tags,
    emotion_tags: over.emotion_tags,
    recipe: over.recipe,
    scent_title: over.scent_title,
    scent_description: over.scent_description,
    user_note: over.user_note || "",
    is_favorite: over.is_favorite || false,
    share_count: over.share_count || 0,
    replay_count: over.replay_count || 0,
    storage_tier: over.storage_tier || "full",
    can_restore: over.can_restore !== false,
    created_at: over.captured_at,
    updated_at: over.captured_at,
  };
}

const recipeCoastal = {
  top: [
    { ingredient: "lemongrass", name: "柠檬草", ratio: 0.3, color: "#F4C95D" },
  ],
  heart: [{ ingredient: "sea_salt", name: "海盐", ratio: 0.2, color: "#A8D8E8" }],
  base: [
    { ingredient: "sandalwood", name: "檀香", ratio: 0.5, color: "#8B6F47" },
  ],
  total_duration_sec: 12,
  ingredients_summary: "檀香 50% · 柠檬草 30% · 海盐 20%",
};

const recipeForest = {
  top: [{ ingredient: "citrus", name: "柑橘", ratio: 0.25, color: "#F4C95D" }],
  heart: [{ ingredient: "cedar", name: "雪松", ratio: 0.35, color: "#C4A8A8" }],
  base: [{ ingredient: "musk", name: "白麝香", ratio: 0.4, color: "#5C4A3A" }],
  total_duration_sec: 10,
  ingredients_summary: "白麝香 40% · 雪松 35% · 柑橘 25%",
};

const recipeRain = {
  top: [{ ingredient: "petrichor", name: "雨土", ratio: 0.4, color: "#9EC5E8" }],
  heart: [{ ingredient: "jasmine", name: "小花茉莉", ratio: 0.3, color: "#D8A8C8" }],
  base: [{ ingredient: "amber", name: "琥珀", ratio: 0.3, color: "#7A6048" }],
  total_duration_sec: 14,
  ingredients_summary: "雨土 40% · 茉莉 30% · 琥珀 30%",
};

const COVERS = {
  a: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop",
  b: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop",
  c: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&auto=format&fit=crop",
  d: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80&auto=format&fit=crop",
  e: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80&auto=format&fit=crop",
};

const RAW_CARDS = [
  card({
    card_id: "card_20260425_moment1",
    live_video_cover: COVERS.a,
    captured_at: "2026-04-25T10:20:00.000Z",
    gps_lat: 30.25,
    gps_lng: 120.15,
    location_name: "杭州·西湖区",
    scene_tags: ["海岸", "公路"],
    emotion_tags: ["辽阔", "自由"],
    recipe: recipeCoastal,
    scent_title: "海岸黄昏的味道",
    scent_description: "夕阳把整片海染成蜜色，风里有盐与柠檬草。",
    user_note: "和小K的毕业旅行前奏",
    is_favorite: true,
    share_count: 3,
    replay_count: 5,
  }),
  card({
    card_id: "card_20260424_a8f3",
    live_video_cover: COVERS.b,
    captured_at: "2026-04-24T18:32:15.000Z",
    gps_lat: 31.23,
    gps_lng: 121.47,
    location_name: "上海·杨浦区",
    scene_tags: ["日落", "城市"],
    emotion_tags: ["温暖", "怀念"],
    recipe: {
      top: [{ ingredient: "grapefruit", name: "西柚", ratio: 0.3, color: "#F4C95D" }],
      heart: [{ ingredient: "cedar", name: "雪松", ratio: 0.2, color: "#B8A090" }],
      base: [{ ingredient: "rose", name: "玫瑰", ratio: 0.5, color: "#C87878" }],
      total_duration_sec: 12,
      ingredients_summary: "玫瑰 50% · 西柚 30% · 雪松 20%",
    },
    scent_title: "公路日落的味道",
    scent_description: "上海晚春的樱花与日落，混在高架的车流里。",
    user_note: "",
    is_favorite: false,
  }),
  card({
    card_id: "card_20260420_g318",
    live_video_cover: COVERS.c,
    captured_at: "2026-04-20T08:10:00.000Z",
    gps_lat: 29.65,
    gps_lng: 91.1,
    location_name: "西藏·318国道",
    scene_tags: ["雪山", "晨雾"],
    emotion_tags: ["勇敢", "清澈"],
    recipe: recipeForest,
    scent_title: "杉林与柑橘的风",
    scent_description: "薄雾里有一点冷杉与柑橘皮，路在脚下发热。",
    is_favorite: true,
  }),
  card({
    card_id: "card_20260328_rain",
    live_video_cover: COVERS.d,
    captured_at: "2026-03-28T21:45:00.000Z",
    gps_lat: 30.28,
    gps_lng: 120.15,
    location_name: "杭州·夜雨街道",
    scene_tags: ["雨夜", "街灯"],
    emotion_tags: ["安静", "柔软"],
    recipe: recipeRain,
    scent_title: "雨夜街道",
    scent_description: "被雨打湿的柏油路，和远处茉莉若有若无。",
  }),
  card({
    card_id: "card_20260315_spring",
    live_video_cover: COVERS.e,
    captured_at: "2026-03-15T14:00:00.000Z",
    gps_lat: 25.0,
    gps_lng: 100.2,
    location_name: "云南·洱海边",
    scene_tags: ["湖风", "午后"],
    emotion_tags: ["松弛", "明亮"],
    recipe: recipeCoastal,
    scent_title: "湖岸微风",
    scent_description: "像晒过的被单与一点海盐。",
  }),
];

function groupByMonth(cards) {
  const map = {};
  for (const c of cards) {
    const d = c.captured_at.slice(0, 7);
    if (!map[d]) map[d] = [];
    map[d].push(c);
  }
  return Object.keys(map)
    .sort((a, b) => b.localeCompare(a))
    .map((ym) => ({
      year_month: ym,
      count: map[ym].length,
      cards: map[ym].sort(
        (a, b) => new Date(b.captured_at) - new Date(a.captured_at)
      ),
    }));
}

function getTodayCards(cards) {
  const t = new Date();
  const y = t.getUTCFullYear();
  const m = String(t.getUTCMonth() + 1).padStart(2, "0");
  const d = String(t.getUTCDate()).padStart(2, "0");
  const prefix = `${y}-${m}-${d}`;
  return cards.filter((c) => c.captured_at.slice(0, 10) === prefix);
}

module.exports = {
  RAW_CARDS,
  groupByMonth,
  getTodayCards,
  getCardById(id) {
    return RAW_CARDS.find((c) => c.card_id === id) || null;
  },
  VIDEO_DEMO,
};
