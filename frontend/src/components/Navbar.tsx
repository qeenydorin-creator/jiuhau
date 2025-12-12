import { siteImages } from '../assets'; // 修复：移除 .js 后缀，让 TS 自动解析

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      {/* 左侧：Logo 和 品牌名 */}
      <div className="flex items-center gap-3">
        <img 
          src={siteImages.logo} 
          alt="九华黄精 Logo" 
          className="h-12 w-12 object-contain" 
        />
        <span className="text-xl font-bold text-gray-800">茶语九华</span>
      </div>
      
      {/* 右侧：简单菜单 */}
      <div className="space-x-4 text-gray-600 font-medium">
        <a href="#home" className="hover:text-stone-800">首页</a>
        <a href="#story" className="hover:text-stone-800">源头工艺</a>
        <a href="#products" className="hover:text-stone-800">产品中心</a>
      </div>
    </nav>
  );
}