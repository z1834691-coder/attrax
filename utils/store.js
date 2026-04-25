const K = { session: "attrax_session_v1" };

function getSession() {
  try {
    return wx.getStorageSync(K.session) || {};
  } catch (e) {
    return {};
  }
}

function setSession(obj) {
  wx.setStorageSync(K.session, { ...getSession(), ...obj });
}

function clearSession() {
  try {
    wx.removeStorageSync(K.session);
  } catch (e) {}
}

module.exports = { getSession, setSession, clearSession, K };
