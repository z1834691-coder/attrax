const { getSession, setSession, clearSession } = require("./utils/store.js");
const { fetchUserMe } = require("./utils/api.js");

App({
  globalData: {
    userInfo: null,
    hasDevice: false,
    deviceId: null,
    openid: null,
  },

  onLaunch() {
    const s = getSession();
    if (s.openid) {
      this.globalData.userInfo = s.userInfo;
      this.globalData.hasDevice = !!s.deviceId;
      this.globalData.deviceId = s.deviceId;
      this.globalData.openid = s.openid;
    }
  },

  applySession(partial) {
    const { getSession } = require("./utils/store.js");
    const s = { ...getSession(), ...partial };
    setSession(s);
    if (s.userInfo) this.globalData.userInfo = s.userInfo;
    if (s.deviceId !== undefined) {
      this.globalData.deviceId = s.deviceId;
      this.globalData.hasDevice = !!s.deviceId;
    }
    if (s.openid) this.globalData.openid = s.openid;
  },

  async refreshProfile() {
    const me = await fetchUserMe();
    this.applySession({ userInfo: { nickname: me.nickname, avatarUrl: me.avatar_url } });
    return me;
  },

  logout() {
    clearSession();
    this.globalData.userInfo = null;
    this.globalData.hasDevice = false;
    this.globalData.deviceId = null;
    this.globalData.openid = null;
  },
});
