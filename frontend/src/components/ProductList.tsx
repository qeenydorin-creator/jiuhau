import products from '../data.json'; // 导入 JSON 数据

export default function ProductList() {
  return (
    <section className="py-16 bg-white" id="products">
      <h2 className="text-3xl font-bold text-center mb-10 text-stone-800">热销产品</h2>
      
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {products.map((product) => (
          <div key={product.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition">
            {/* 产品图 */}
            <div className="h-64 mb-4 overflow-hidden rounded-lg bg-gray-50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            
            {/* 文字信息 */}
            <h3 className="text-lg font-bold mb-2">{product.name}</h3>
            <p className="text-gray-500 text-sm mb-3 h-10 overflow-hidden">{product.desc}</p>
            <div className="flex justify-between items-center">
              <span className="text-red-600 font-bold text-xl">{product.price}</span>
              <button className="bg-stone-800 text-white px-3 py-1 rounded text-sm hover:bg-stone-700">
                查看详情
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}