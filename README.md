# attrax · 自驾气味相册 微信小程序

Drive, Live, Perfume — and it's life

## 协作开发

```bash
git clone https://github.com/z1834691-coder/attrax.git
cd attrax
```

使用 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 打开本目录（「导入项目」→ 选择该文件夹）。

在 `project.config.json` 中配置你的小程序 **AppID**；开发期可在工具中关闭域名校验，上线前请在微信公众平台配置**合法域名**（图片、视频、请求等）。

## 结构说明

- `pages/` 页面（相册、卡片详情、设备、我的、登录绑定等）
- `components/` 通用组件（如宝丽来风格 `polaroid-card`）
- `utils/` Mock 数据与 API 封装，可替换为真实 HTTPS 后端

## License

项目代码以仓库内约定为准。
