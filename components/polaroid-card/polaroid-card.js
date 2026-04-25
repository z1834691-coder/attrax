const recipeDots = (recipe) => {
  if (!recipe) return ["#F4C95D", "#E8A8A8", "#8B6F47"];
  const t = recipe.top?.[0]?.color;
  const m = recipe.heart?.[0]?.color;
  const b = recipe.base?.[0]?.color;
  return [t, m, b].filter(Boolean);
};

Component({
  properties: {
    card: { type: Object, value: {} },
    delay: { type: Number, value: 0 },
    compact: { type: Boolean, value: false },
    archived: { type: Boolean, value: false },
    selected: { type: Boolean, value: false },
  },
  data: {
    mediaPadding: 70,
    dotColors: ["#F4C95D", "#E8A8A8", "#8B6F47"],
  },
  observers: {
    "card": function (c) {
      this.setData({ dotColors: recipeDots(c && c.recipe) });
    },
  },
  methods: {
    onTap() {
      this.triggerEvent("tap", { card: this.properties.card });
    },
  },
});
