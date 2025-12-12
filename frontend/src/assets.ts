// 这是一个专门管理“静态资源”的配置文件
// 作用：统一管理网站的 Logo、背景、插图，方便以后一键替换

export const siteImages = {
  // ==============================
  // 1. 核心品牌视觉 (Core)
  // ==============================
  
  // 对应你的【图3】：茶说九华 Logo
  logo: "https://res.cloudinary.com/dgzsameje/image/upload/v1765448194/logo_tjxf6k.jpg",

  // 对应你的【图5】：主页大背景图 (Hero Banner)
  // 建议：这张图在 Cloudinary 里最好加上 fl_progressive 参数，加载更流畅
  heroBg: "https://res.cloudinary.com/dgzsameje/image/upload/v1765448215/hero-bg_i966ai.jpg",


  // ==============================
  // 2. 源头故事 (Origin Story)
  // ==============================

  // 对应你的【图2】：深山挖黄精
  // 用途：放在“品牌故事”或“源头”板块
  storyDigging: "https://res.cloudinary.com/dgzsameje/image/upload/v1765448203/story-digging_ouhilt.jpg",

  // 对应你的【图4】：鲜活黄精 (刚刚出土的原料)
  // 用途：展示原料的新鲜度
  storyFresh: "https://res.cloudinary.com/dgzsameje/image/upload/v1765448212/story-fresh_auy7zd.jpg",


  // ==============================
  // 3. 非遗工艺流程 (Craft Process)
  // ==============================

  // 对应你的【图1】：清洗黄精工序
  // 用途：展示泉水清洗，干净卫生
  craftWashing: "https://res.cloudinary.com/dgzsameje/image/upload/v1765448214/craft-washing_bt2pye.jpg",

  // 对应你的【图9】：九蒸工序
  // 用途：展示九蒸九晒，传统古法
  craftSteaming: "https://res.cloudinary.com/dgzsameje/image/upload/v1765448213/craft-steaming_lv1t6u.jpg"
};