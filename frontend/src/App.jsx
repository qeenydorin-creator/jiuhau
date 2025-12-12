import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 引入图标库
import {
  ShoppingBag, User, Search, Leaf,
  Minus, Plus, X, Globe, CheckCircle2,
  MapPin, Mail, Phone, LogOut, Check, ArrowRight, Menu, ChevronDown, Loader2, Edit, Save
} from 'lucide-react';

/**
 * --- 品牌视觉规范 (完整版：含所有UI组件 + 后端交互 + 库存管理) ---
 */

// --- 1. 配置与工具 ---

// 后端地址
// 本地开发用 localhost，上线部署时请确保 Vercel 环境变量 VITE_API_URL 已设置
const API_BASE_URL = "http://localhost:8000"; 
// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const LANGUAGES = [
  { code: 'zh-CN', label: '简体中文' }, 
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' }, 
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' }, 
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' }, 
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' }, 
  { code: 'ar', label: 'العربية', dir: 'rtl' }
];

const I18N_DB = {
  'zh-CN': {
    brand: '国精商务-茶说九华', slogan: '一根黄精 精养全球',
    nav: { home: '首页', history: '品牌溯源', craft: '九蒸九晒', products: '甄选系列', culture: '禅养文化' },
    hero: { sub: '源自九华山脉 · 道地多花黄精', btn_buy: '立即选购', btn_craft: '探索工艺' },
    history: { title: '云深不知处', sub: '九华山 · 北纬30°的自然奇迹' },
    craft: { title: '古法炮制', sub: '历经九次水火交融', steps: ['鲜选', '泉洗', '九蒸', '九晒'] },
    products: { title: '自然馈赠', sub: '高端养生系列', loading: '正在获取最新产品...', stock: '库存' },
    member: { title: '会员尊享', login: '登录/注册', welcome: '尊贵会员 (管理员模式)' },
    admin: { edit: '编辑', save: '保存', cancel: '取消', price: '价格', stock: '库存' }
  },
  'en': {
    brand: 'Guojing - Tea Speaks Jiuhua', slogan: 'One Root, Nourishing the World',
    nav: { home: 'Home', history: 'Origin', craft: 'Craft', products: 'Products', culture: 'Culture' },
    hero: { sub: 'Authentic Polygonatum from Mt. Jiuhua', btn_buy: 'Shop Now', btn_craft: 'Process' },
    history: { title: 'Deep in the Clouds', sub: 'Mt. Jiuhua · Miracle of N30°' },
    craft: { title: 'Ancient Craft', sub: 'Nine Steams & Nine Sun-dryings', steps: ['Select', 'Wash', 'Steam', 'Dry'] },
    products: { title: 'Nature\'s Gift', sub: 'Premium Wellness Series', loading: 'Loading products...', stock: 'Stock' },
    member: { title: 'VIP Club', login: 'Login / Sign Up', welcome: 'VIP Admin' },
    admin: { edit: 'Edit', save: 'Save', cancel: 'Cancel', price: 'Price', stock: 'Stock' }
  },
  // 其他语言会自动回退到中文，为节省空间这里不再重复列出完整字典，但代码逻辑支持回退
};

const useTrans = (lang) => {
  return (key) => {
    const keys = key.split('.');
    let res = I18N_DB[lang];
    if (!res && I18N_DB['zh-CN']) res = I18N_DB['zh-CN'];
    
    for (const k of keys) res = res?.[k];
    if (res) return res;

    let fallback = I18N_DB['zh-CN'];
    for (const k of keys) fallback = fallback?.[k];
    return fallback || key;
  };
};

// --- 2. 默认产品数据 (兜底用) ---
const DEFAULT_PRODUCTS = [
  { 
    id: 'p1', 
    name: '九华御精·尊享礼盒', 
    price: 1680, 
    stock: 50,
    category: 'gift', 
    image: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765448060/product-slice_pfku2d.jpg', 
    desc: '非遗大师手作包装，甄选切片，商务馈赠首选。' 
  },
  { 
    id: 'p5', 
    name: '手工九制黄精芝麻丸', 
    price: 198, 
    stock: 200,
    category: 'snack', 
    image: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765448059/product-pill_swrsms.jpg', 
    desc: '传统手工搓制，融合黑芝麻与蜂蜜，乌发养颜。' 
  },
  { 
    id: 'p2', 
    name: '九蒸九晒黄精茶 (罐装)', 
    price: 368, 
    stock: 100,
    category: 'tea', 
    image: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765448060/product-tea_jefijt.jpg', 
    desc: '汤色如琥珀，口感绵柔。每天一杯，补气养阴。' 
  },
  { 
    id: 'p3', 
    name: '即食黄精果 (袋装)', 
    price: 128, 
    stock: 150,
    category: 'snack', 
    image: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765448061/product-snack_tmeau1.jpg', 
    desc: '软糯香甜，0添加蔗糖。随时随地的元气补给站。' 
  },
  { 
    id: 'p4', 
    name: '破壁黄精粉', 
    price: 299, 
    stock: 80,
    category: 'powder', 
    image: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765512159/polygonatum-powder_gonl53.jpg', 
    desc: '超微粉碎技术，细腻易吸收。可搭配牛奶、蜂蜜食用。' 
  },
];

// --- 3. App Component ---
const App = () => {
  const [lang, setLang] = useState('zh-CN');
  const t = useTrans(lang);
  const [activePage, setActivePage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 后端数据状态
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // 获取数据
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.warn("后端请求失败，使用默认数据");
        setProducts(DEFAULT_PRODUCTS);
      }
    } catch (err) {
      console.warn("无法连接后端，使用默认数据:", err);
      setProducts(DEFAULT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (p) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === p.id);
      return ex ? prev.map(i => i.id === p.id ? {...i, qty: i.qty+1} : i) : [...prev, {...p, qty: 1}];
    });
    setCartOpen(true);
  };

  // 管理员更新产品
  const handleUpdateProduct = async (id, newPrice, newStock) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: Number(newPrice), stock: Number(newStock) })
      });
      
      if (res.ok) {
        await fetchProducts(); // 刷新列表
        setEditingProduct(null);
        // 这里可以加一个简单的 alert 或者 toast
      } else {
        alert("更新失败，请检查后端连接。");
      }
    } catch (e) {
      alert("网络错误，无法连接服务器。");
    }
  };

  const navigate = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(page);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#2c3e50] font-sans selection:bg-[#d4af37] selection:text-white" dir={LANGUAGES.find(l=>l.code===lang)?.dir || 'ltr'}>
      <Navbar t={t} lang={lang} setLang={setLang} activePage={activePage} navigate={navigate} cartCount={cartItems.reduce((a,b)=>a+b.qty,0)} openCart={()=>setCartOpen(true)} openMember={()=>setMemberOpen(true)} isLoggedIn={isLoggedIn} />
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {activePage === 'home' && <HomePage key="home" t={t} navigate={navigate} />}
          {activePage === 'history' && <HistoryPage key="history" t={t} />}
          {activePage === 'craft' && <CraftPage key="craft" t={t} />}
          {activePage === 'products' && (
            <ProductsPage 
              key="products" 
              t={t} 
              addToCart={addToCart} 
              products={products} 
              loading={loading} 
              isLoggedIn={isLoggedIn}
              onEdit={(p) => setEditingProduct(p)}
            />
          )}
          {activePage === 'culture' && <CulturePage key="culture" t={t} />}
        </AnimatePresence>
      </main>
      <Footer t={t} />
      <CartDrawer isOpen={cartOpen} onClose={()=>setCartOpen(false)} items={cartItems} />
      <MemberModal isOpen={memberOpen} onClose={()=>setMemberOpen(false)} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} t={t} />
      
      <EditModal 
        isOpen={!!editingProduct} 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdateProduct}
        t={t}
      />
    </div>
  );
};

// --- 4. 页面组件 ---

// 4.1 首页 (Home)
const HomePage = ({ t, navigate }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://res.cloudinary.com/dgzsameje/image/upload/v1765448215/hero-bg_i966ai.jpg" className="w-full h-full object-cover opacity-90" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
      </div>
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-8 pt-10 z-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#556b2f]/10 text-[#556b2f] border border-[#556b2f]/20 rounded-full text-sm font-bold backdrop-blur-sm">
            <Leaf className="w-4 h-4" /> {t('hero.sub')}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-7xl font-serif text-[#2c3e50] leading-tight">
            {t('brand')} <br /> <span className="text-[#d4af37] text-5xl md:text-6xl mt-2 block font-light">{t('slogan')}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-gray-700 text-lg max-w-md leading-relaxed font-medium">
            取九华之灵气，得黄精之精髓。<br/>专注道地多花黄精产业，将东方养生智慧献给世界。
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-4">
            <button onClick={()=>navigate('products')} className="px-10 py-4 bg-[#d4af37] text-white rounded-sm font-medium hover:bg-[#b8962e] transition-all shadow-xl flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> {t('hero.btn_buy')}
            </button>
            <button onClick={()=>navigate('craft')} className="px-10 py-4 bg-white/50 border border-gray-300 text-[#2c3e50] rounded-sm font-medium hover:bg-white hover:border-[#d4af37] transition-all backdrop-blur-sm">
              {t('hero.btn_craft')} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        </div>
        <div className="md:w-1/2 relative h-[600px] flex items-center justify-center">
           <div className="relative w-full max-w-[600px]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-3xl animate-pulse" />
             <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="relative z-10">
               <img src="https://res.cloudinary.com/dgzsameje/image/upload/v1765448212/story-fresh_auy7zd.jpg" className="w-full h-auto drop-shadow-2xl rounded-3xl border-4 border-white/50 object-cover aspect-[4/3]" alt="Fresh" />
               <div className="absolute bottom-10 -left-6 bg-white/90 backdrop-blur px-6 py-4 rounded-sm shadow-lg border-l-4 border-[#556b2f]">
                 <div className="flex items-center gap-3">
                   <div className="bg-[#556b2f] p-2 rounded-full text-white"><CheckCircle2 className="w-4 h-4" /></div>
                   <div><p className="text-sm font-bold text-[#2c3e50]">仿野生抚育</p><p className="text-xs text-gray-500">模拟自然生长环境</p></div>
                 </div>
               </div>
             </motion.div>
           </div>
        </div>
      </div>
    </section>
  </motion.div>
);

// 4.2 品牌历史 (History) - 完整版
const HistoryPage = ({ t }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">
    <div className="bg-[#2c3e50] text-white py-24 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <h2 className="text-4xl font-serif mb-4 relative z-10">{t('history.title')}</h2>
      <p className="text-[#d4af37] tracking-[0.3em] uppercase text-sm relative z-10">{t('history.sub')}</p>
    </div>
    <div className="container mx-auto px-6 -mt-20 relative z-10">
      <div className="bg-white shadow-xl rounded-sm p-8 md:p-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[400px] overflow-hidden rounded-sm group">
          <img
            src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=800"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Misty Jiuhua"
          />
          <div className="absolute bottom-4 left-4 text-white text-xs bg-black/30 px-2 py-1 backdrop-blur-sm">九华山天台景区实拍</div>
        </div>
        <div className="space-y-6 font-serif text-lg leading-loose text-gray-600">
          <p>
            <span className="text-6xl text-[#d4af37] float-left mr-3 mt-[-10px] font-bold opacity-80">九</span>
            华山，中国佛教四大名山之一。这里常年云雾缭绕，负氧离子含量极高，独特的酸性腐殖土富含微量元素硒。
          </p>
          <p>
            茶说九华的种植基地便坐落于此。我们拒绝大棚温室，坚持“林下仿野生”抚育模式。每一根黄精都需历经至少5年的自然生长，吸纳日月精华，方能成材。
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);

// 4.3 古法工艺 (Craft) - 完整版
const CraftPage = ({ t }) => {
  const steps = [
    { title: '鲜选', img: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765448203/story-digging_ouhilt.jpg', desc: '人工挖掘，甄选肉质肥厚根茎' },
    { title: '泉洗', img: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765448214/craft-washing_bt2pye.jpg', desc: '引九华山天然泉水反复冲洗' },
    { title: '九蒸', img: 'https://res.cloudinary.com/dgzsameje/image/upload/v1765448213/craft-steaming_lv1t6u.jpg', desc: '传统柴火慢蒸，铜锅炮制' },
    { title: '九晒', img: 'https://images.unsplash.com/photo-1533230699263-14902120df0f?auto=format&fit=crop&q=80&w=600', desc: '高山阳光晾晒，吸纳纯阳之气' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#f5f5f0] py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-[#2c3e50] mb-3">{t('craft.title')}</h2>
          <p className="text-gray-500 text-sm tracking-widest uppercase">{t('craft.sub')}</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4 h-[500px]">
          {steps.map((s, i) => (
            <div key={i} className="group relative h-full overflow-hidden rounded-sm cursor-pointer shadow-lg">
              <img src={s.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt={s.title} />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="text-[#d4af37] text-6xl font-serif font-bold opacity-50 absolute top-4 right-4">0{i+1}</div>
                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="text-3xl font-bold mb-2 font-serif">{s.title}</h3>
                  <div className="h-[2px] w-12 bg-[#d4af37] mb-3" />
                  <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// 4.4 产品系列 (Products) - 完整版 (含编辑功能)
const ProductsPage = ({ t, addToCart, products, loading, isLoggedIn, onEdit }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-serif text-[#2c3e50]">{t('products.title')}</h2>
          <p className="text-[#d4af37] text-sm mt-2">{t('products.sub')}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mb-2" />
          <p className="text-sm font-serif">{t('products.loading')}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(p => (
            <div key={p.id} className="group bg-white border border-gray-100 rounded-sm hover:shadow-2xl transition-all duration-300 flex flex-col relative">
              {isLoggedIn && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(p); }}
                  className="absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full shadow-md text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              
              <div className="relative h-72 overflow-hidden bg-[#f9f9f9] p-8 flex items-center justify-center">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                {p.category === 'gift' && <div className="absolute top-0 left-0 bg-[#d4af37] text-white text-xs px-3 py-1">镇店</div>}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif text-lg text-[#2c3e50] mb-2 truncate">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-2 h-8 line-clamp-2">{p.desc}</p>
                <p className="text-xs text-gray-400 mb-4">{t('products.stock')}: {p.stock !== undefined ? p.stock : '-'}</p>
                
                <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                  <span className="text-[#d4af37] font-bold text-lg">¥ {p.price}</span>
                  <button onClick={() => addToCart(p)} className="w-8 h-8 rounded-full bg-[#f5f5f0] flex items-center justify-center text-[#2c3e50] hover:bg-[#d4af37] hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

// 4.5 禅养文化 (Culture) - 完整版
const CulturePage = ({ t }) => (
  <div className="h-[60vh] flex flex-col items-center justify-center bg-[#fcfcfc] text-gray-400">
    <Leaf className="w-16 h-16 text-[#d4af37] mb-6 opacity-50" />
    <h2 className="text-3xl font-serif text-[#2c3e50] mb-2">以禅入茶，以茶养心</h2>
    <p>即将呈现...</p>
  </div>
);

// --- 5. 通用组件 ---

// 编辑弹窗
const EditModal = ({ isOpen, product, onClose, onSave, t }) => {
  if (!isOpen || !product) return null;
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);

  useEffect(() => {
    if(product) {
      setPrice(product.price);
      setStock(product.stock);
    }
  }, [product]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-lg p-6 w-full max-w-sm relative z-10 shadow-2xl">
        <h3 className="text-lg font-bold mb-4 font-serif text-[#2c3e50]">{t('admin.edit')} - {product.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t('admin.price')} (¥)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border border-gray-300 rounded p-2 focus:border-[#d4af37] outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">{t('admin.stock')}</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="w-full border border-gray-300 rounded p-2 focus:border-[#d4af37] outline-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">{t('admin.cancel')}</button>
            <button onClick={() => onSave(product.id, price, stock)} className="flex-1 py-2 bg-[#d4af37] text-white rounded hover:bg-[#b8962e] flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {t('admin.save')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ t, lang, setLang, activePage, navigate, cartCount, openCart, openMember, isLoggedIn }) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const logoUrl = "https://res.cloudinary.com/dgzsameje/image/upload/v1765448194/logo_tjxf6k.jpg";

  return (
    <nav className="fixed top-0 w-full h-20 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 transition-all">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
          <img src={logoUrl} className="w-10 h-10 object-cover rounded-sm" alt="Logo" />
          <div>
            <h1 className="text-lg font-bold text-[#2c3e50] tracking-widest leading-none">{t('brand')}</h1>
            <p className="text-[9px] text-[#d4af37] uppercase tracking-wider mt-1 font-medium">Tea Speaks Jiuhua</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 font-medium text-sm text-gray-600">
          {['home', 'history', 'craft', 'products', 'culture'].map(key => (
            <button
              key={key}
              onClick={() => navigate(key)}
              className={`hover:text-[#d4af37] transition-colors relative py-2 ${activePage === key ? 'text-[#d4af37]' : ''}`}
            >
              {t(`nav.${key}`)}
              {activePage === key && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d4af37]" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1 text-xs font-bold hover:text-[#d4af37] border border-gray-200 px-3 py-1.5 rounded-full transition-all">
              <Globe className="w-3.5 h-3.5" />
              {LANGUAGES.find(l=>l.code===lang)?.label}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-sm py-2 z-20 max-h-96 overflow-y-auto">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-xs hover:bg-[#f5f5f0] flex justify-between items-center ${lang === l.code ? 'text-[#d4af37] font-bold bg-[#fcfcfc]' : 'text-gray-600'}`}
                    >
                      {l.label}
                      {lang === l.code && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative cursor-pointer hover:text-[#d4af37] transition-colors" onClick={openCart}>
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartCount}</span>}
          </div>

          <button
            onClick={openMember}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md border ${isLoggedIn ? 'bg-[#d4af37] text-white border-[#d4af37]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#d4af37] hover:text-[#d4af37]'}`}
          >
            <User className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const MemberModal = ({ isOpen, onClose, isLoggedIn, setIsLoggedIn, t }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-lg shadow-2xl relative z-10 overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X className="w-5 h-5"/></button>
        <div className="bg-[#2c3e50] p-8 text-center text-white">
          <div className="w-16 h-16 bg-[#d4af37] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg border-4 border-[#2c3e50]">
            <User className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif">{isLoggedIn ? t('member.welcome') : t('member.title')}</h3>
          <p className="text-xs opacity-60 mt-1">{t('slogan')}</p>
        </div>
        <div className="p-8">
          {isLoggedIn ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-[#f5f5f0] rounded-lg">
                <p className="text-xs text-gray-500">当前身份</p>
                <p className="text-xl font-bold text-[#d4af37]">管理员 (Admin)</p>
                <p className="text-xs text-gray-400 mt-2">您可以点击产品卡片上的编辑按钮修改价格和库存。</p>
              </div>
              <button onClick={() => setIsLoggedIn(false)} className="w-full py-3 text-gray-400 hover:text-red-500 text-sm flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> 退出登录
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <input type="text" className="w-full border border-gray-200 rounded p-3 text-sm focus:border-[#d4af37] outline-none" placeholder="手机号 (123456)" />
              </div>
              <div className="space-y-2">
                <input type="password" className="w-full border border-gray-200 rounded p-3 text-sm focus:border-[#d4af37] outline-none" placeholder="密码 (password)" />
              </div>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-[#d4af37] text-white py-3 rounded font-bold hover:bg-[#b8962e] transition-colors mt-4"
              >
                {t('member.login')}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose, items }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          className="fixed top-0 right-0 h-full w-96 bg-white z-[70] shadow-2xl p-6 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl text-[#2c3e50]">茶篮</h2>
            <X className="cursor-pointer" onClick={onClose} />
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                <img src={item.image} className="w-16 h-16 object-cover rounded bg-gray-50" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#2c3e50]">{item.name}</h4>
                  <div className="flex justify-between mt-2">
                    <span className="text-[#d4af37] font-bold">¥{item.price}</span>
                    <span className="text-gray-400 text-xs">x{item.qty}</span>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="text-center text-gray-400 mt-20">暂无商品</div>}
          </div>
          <div className="pt-6 border-t border-gray-100">
            <button className="w-full bg-[#2c3e50] text-white py-3 rounded-sm font-bold hover:bg-[#d4af37] transition-colors">
              去结算
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Footer = ({ t }) => {
  const logoUrl = "https://res.cloudinary.com/dgzsameje/image/upload/v1765448194/logo_tjxf6k.jpg";
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 py-16 text-sm text-center">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={logoUrl} className="w-8 h-8 object-cover rounded-sm opacity-80" alt="Logo" />
          <span className="text-xl font-serif text-white">{t('brand')}</span>
        </div>
        <p className="opacity-60 mb-8">{t('slogan')}</p>
        <div className="border-t border-white/10 pt-8 text-xs opacity-40">
          © 2025 Tea Speaks Jiuhua. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default App;