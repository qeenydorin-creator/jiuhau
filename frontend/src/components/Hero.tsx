import { siteImages } from '../assets.js'; // 修复：添加 .js 后缀

export default function Hero() {
  return (
    <div 
      id="home"
      className="relative h-[600px] flex items-center justify-center text-white"
      style={{
        // 动态设置背景图
        backgroundImage: `url(${siteImages.heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 黑色遮罩，防止字看不清 */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">道地九华山，九蒸九晒</h1>
        <p className="text-xl md:text-2xl font-light opacity-90">传承千年古法，只为一颗好黄精</p>
        <button className="mt-8 px-8 py-3 bg-stone-100 text-stone-900 rounded-full font-bold hover:bg-white transition hover:scale-105">
          探索源头
        </button>
      </div>
    </div>
  );
}