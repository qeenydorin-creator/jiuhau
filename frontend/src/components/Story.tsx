import { siteImages } from '../assets.js'; // 修复：添加 .js 后缀

export default function Story() {
  // 定义一个小数组方便循环显示这4张图
  const steps = [
    { title: "深山采挖", img: siteImages.storyDigging, desc: "寻觅九华深处老根" },
    { title: "鲜选原料", img: siteImages.storyFresh, desc: "个大饱满肉质厚" },
    { title: "泉水清洗", img: siteImages.craftWashing, desc: "引山泉洗净泥沙" },
    { title: "九蒸九晒", img: siteImages.craftSteaming, desc: "古法炮制黑如漆" },
  ];

  return (
    <section className="py-20 bg-stone-50" id="story">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">从深山到杯中</h2>
          <div className="w-16 h-1 bg-stone-400 mx-auto"></div>
          <p className="mt-4 text-stone-600">每一道工序，都是对时间的致敬</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="h-56 overflow-hidden">
                <img 
                  src={step.img} 
                  alt={step.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl mb-2 text-stone-800">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}