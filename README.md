# attrax · 自驾气味相册 微信小程序

Drive, Live, Perfume — and it's life

## 协作开发

```bash
git clone https://github.com/z1834691-coder/attrax.git
cd attrax
```

使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开本目录（「导入项目」→ 选择该文件夹）。

在 `project.config.json` 中配置你的小程序 **AppID**；开发期可在工具中关闭域名校验，上线前请在微信公众平台配置**合法域名**（图片、视频、请求等）。

### 推送到 GitHub（终端连不上时）

若出现 `Failed to connect to github.com port 443`，通常是**终端未走系统代理**，而浏览器可以。请先**打开**你本机用于访问 GitHub 的工具（如 **Hiddify**），再在**系统终端**执行：

```bash
cd /path/to/attrax-miniprogram
bash scripts/push-github.sh
```

本仓库已对 `https://github.com/` 配置 **SOCKS 代理**（默认 `socks5h://127.0.0.1:10793`，与常见 Hiddify 端口一致）。若你的 SOCKS 端口不同，可先查：

```bash
scutil --proxy | grep -E 'SOCKS|Proxy'
```

再设置（示例端口 `10793`）：

```bash
git config http.https://github.com/.proxy socks5h://127.0.0.1:10793
```

推送时若提示登录：**Username** = GitHub 用户名；**Password** = **Personal Access Token**（在 GitHub → Settings → Developer settings 中创建，勾选 `repo`）。已启用 `credential.helper=osxkeychain` 时，成功一次后会记入钥匙串。

## 结构说明

- `pages/` 页面（相册、卡片详情、设备、我的、登录绑定等）
- `components/` 通用组件（如宝丽来风格 `polaroid-card`）
- `utils/` Mock 数据与 API 封装，可替换为真实 HTTPS 后端

## License

项目代码以仓库内约定为准。
