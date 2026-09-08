import React, { useState, useEffect, useRef } from 'react';
import FooterStore from './FooterStore';

// ==========================================
// UTILS: Helper Function untuk Format Harga
// ==========================================
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '0';
  return new Intl.NumberFormat('id-ID').format(price);
};

export default function HomeStore({ products = [] }) {
  // State Keranjang Belanja
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const [checkoutSummary, setCheckoutSummary] = useState(null);

  // State Lightbox & Qty
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenQty, setFullscreenQty] = useState(1);
  const [detailQty, setDetailQty] = useState(1);

  // State Dark Mode & Pop-up Chat
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo! Ada yang bisa kami bantu mengenai produk LOS BRAND?' }
  ]);
  const chatBottomRef = useRef(null);

  // Auto scroll ke pesan chat terbaru
  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Handler Kirim Pesan Chat
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    // Simulasi Balasan Otomatis Admin/Bot
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Terima kasih atas pesan Anda! Tim CS kami akan segera membalasnya.'
        }
      ]);
    }, 1000);
  };

  // Cart Handlers
  const addToCart = (product, customQuantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + customQuantity } : item
        );
      }
      return [...prev, { ...product, qty: customQuantity }];
    });

    if (!selectedCartIds.includes(product.id)) {
      setSelectedCartIds((prev) => [...prev, product.id]);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    setSelectedCartIds((prev) => prev.filter((cartId) => cartId !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const toggleSelectCartItem = (id) => {
    setSelectedCartIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCartIds.length === cart.length) {
      setSelectedCartIds([]);
    } else {
      setSelectedCartIds(cart.map((item) => item.id));
    }
  };

  const getItemQtyInCart = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.qty : 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const selectedItems = cart.filter((item) => selectedCartIds.includes(item.id));
  const selectedTotalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;

    setCheckoutSummary({
      items: [...selectedItems],
      total: selectedTotalPrice,
    });

    setCart((prev) => prev.filter((item) => !selectedCartIds.includes(item.id)));
    setSelectedCartIds([]);
    setIsCartOpen(false);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Header Responsif dengan Darkmode di Tengah */}
      <header className={`sticky top-0 z-30 border-b shadow-sm transition-colors ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 grid grid-cols-3 items-center">
          
          {/* Bagian Kiri: Logo & Navigasi */}
          <div className="flex items-center gap-2 sm:gap-6 justify-start">
            <h1 className="text-base sm:text-xl font-black tracking-tight text-indigo-500 whitespace-nowrap">LOS BRAND</h1>
            <a
              href="/app"
              className={`text-xs sm:text-sm font-semibold transition flex items-center gap-1 ${isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden xs:inline">Home</span>
            </a>
          </div>

          {/* Bagian Tengah: Tombol Dark Mode Toggle (Presisi di Tengah) */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-sm ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{isDarkMode ? '☀️' : '🌙'}</span>
              <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* Bagian Kanan: Ruang Penyeimbang / Bantuan */}
          <div className="flex justify-end">
            {/* Ruang penyeimbang grid agar Darkmode tetap di tengah */}
          </div>

        </div>
      </header>

      {/* Floating Cart Button & Drawer Responsif */}
      <div className="fixed top-3 right-3 sm:right-4 z-40 flex flex-col items-end">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative bg-gray-900 text-white px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-800 transition shadow-lg flex items-center gap-1.5 sm:gap-2 border border-gray-700"
        >
          <span>🛒</span>
          <span className="hidden sm:inline">Cart</span>
          <span className="bg-indigo-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold">
            {totalItems}
          </span>
        </button>

        {isCartOpen && (
          <div className={`mt-2 border rounded-2xl p-4 sm:p-5 shadow-2xl w-[90vw] max-w-xs sm:max-w-none sm:w-96 animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm sm:text-base font-bold">Shopping Cart</h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-6">Your cart is empty.</p>
            ) : (
              <>
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-200 dark:border-gray-800">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={cart.length > 0 && selectedCartIds.length === cart.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="select-all" className="text-xs font-semibold cursor-pointer select-none">
                    Pilih Semua ({selectedCartIds.length}/{cart.length})
                  </label>
                </div>

                <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-60 sm:max-h-72 overflow-y-auto pr-1 mb-3 space-y-2">
                  {cart.map((item) => {
                    const isChecked = selectedCartIds.includes(item.id);

                    return (
                      <li key={item.id} className="pt-2 flex gap-2 items-center text-xs sm:text-sm">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectCartItem(item.id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                        />

                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border flex-shrink-0 dark:border-gray-700"
                        />

                        <div className="flex-1 min-w-0">
                          <span className="font-semibold block truncate text-xs">
                            {item.name}
                          </span>
                          <span className="text-gray-500 text-[11px]">Rp {formatPrice(item.price)}</span>
                          
                          <div className="flex items-center gap-1.5 mt-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold px-1">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="font-bold text-xs">
                            Rp {formatPrice(item.price * item.qty)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-[11px] font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t dark:border-gray-800 pt-3 flex justify-between font-bold text-xs sm:text-sm mb-3">
                  <span>Total ({selectedItems.reduce((acc, curr) => acc + curr.qty, 0)} barang):</span>
                  <span className="text-indigo-500">Rp {formatPrice(selectedTotalPrice)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className={`w-full py-2.5 rounded-xl font-medium transition text-xs sm:text-sm shadow flex items-center justify-center gap-2 ${
                    selectedItems.length > 0 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>Checkout Now ({selectedItems.length})</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hero Banner Responsif */}
      <section className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white py-10 md:py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 md:space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[11px] sm:text-xs font-semibold rounded-full border border-indigo-500/30">
              New Apparel Collection
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Simple Style, Premium Quality.
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Temukan pakaian bergaya minimalis modern dengan potongan presisi dan bahan premium berkualitas tinggi.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content - Grid Responsif (1 Col HP, 2 Col Tablet, 4 Col Desktop) */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Featured Products</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products?.map((product) => {
            const itemQty = getItemQtyInCart(product.id);

            return (
              <div 
                key={product.id} 
                className={`border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition ${
                  isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                }`}
              >
                <div>
                  <div 
                    className="relative group cursor-pointer" 
                    onClick={() => {
                      setFullscreenImage(product);
                      setFullscreenQty(1);
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition duration-300" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <span className="bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 backdrop-blur-sm">
                        🔍 View Fullscreen
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-base sm:text-lg leading-snug">{product.name}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{product.category}</p>
                    <p className="text-indigo-500 font-bold mt-1.5 text-sm sm:text-base">Rp {formatPrice(product.price)}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  <div className="relative">
                    {itemQty > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow z-10 animate-in zoom-in-50">
                        {itemQty}
                      </span>
                    )}
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-xs sm:text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setDetailQty(1);
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition text-xs sm:text-sm ${
                      isDarkMode ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    Detail
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Product Detail Modal Responsif */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-xl relative max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 z-10 font-bold"
            >
              ✕
            </button>

            <div className="p-5 sm:p-6">
              <div 
                className="relative group cursor-pointer rounded-xl overflow-hidden mb-4"
                onClick={() => {
                  setFullscreenImage(selectedProduct);
                  setFullscreenQty(detailQty);
                }}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-52 sm:h-64 object-cover"
                />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-500 rounded-md">
                {selectedProduct.category || 'Apparel'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-2">{selectedProduct.name}</h3>
              <p className="text-base sm:text-lg font-bold text-indigo-500 mt-1">
                Rp {formatPrice(selectedProduct.price)}
              </p>
              
              <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
                Detail kaos berbahan cotton premium yang nyaman dipakai harian dengan potongan reguler modern.
              </p>

              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold">Jumlah Pembelian:</span>
                <div className={`flex items-center gap-2.5 p-1 rounded-xl border ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                }`}>
                  <button
                    onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg font-bold text-xs shadow-sm transition"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-xs sm:text-sm w-5 text-center">{detailQty}</span>
                  <button
                    onClick={() => setDetailQty((prev) => prev + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg font-bold text-xs shadow-sm transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-2.5">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, detailQty);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition text-xs sm:text-sm"
                >
                  Tambah ke Keranjang ({detailQty})
                </button>

                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs sm:text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Fullscreen Responsif (Tombol Cart & Qty Lengkap) */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full h-full max-w-4xl flex flex-col items-center justify-between py-4" onClick={(e) => e.stopPropagation()}>
            
            {/* Tombol Tutup Fullscreen */}
            <div className="w-full flex justify-end">
              <button
                onClick={() => setFullscreenImage(null)}
                className="bg-white/20 hover:bg-white/40 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Gambar Fullscreen */}
            <div className="flex-1 flex items-center justify-center my-auto overflow-hidden py-2">
              <img 
                src={fullscreenImage.image} 
                alt={fullscreenImage.name} 
                className="max-h-[50vh] sm:max-h-[65vh] md:max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl" 
              />
            </div>

            {/* Panel Kontrol Bawah Responsif */}
            <div className="bg-gray-900/95 border border-gray-800 p-3.5 sm:p-4 rounded-2xl w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-3 text-white backdrop-blur-md shadow-2xl mt-auto">
              <div className="text-center sm:text-left w-full sm:w-auto">
                <h4 className="font-bold text-xs sm:text-sm leading-tight truncate max-w-[200px] sm:max-w-none">{fullscreenImage.name}</h4>
                <p className="text-indigo-400 font-extrabold text-xs sm:text-sm mt-0.5">Rp {formatPrice(fullscreenImage.price)}</p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
                {/* Selector Qty */}
                <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 p-1 rounded-xl">
                  <button
                    onClick={() => setFullscreenQty((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs w-4 text-center">{fullscreenQty}</span>
                  <button
                    onClick={() => setFullscreenQty((prev) => prev + 1)}
                    className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Tombol Add to Cart Fullscreen */}
                <button
                  onClick={() => {
                    addToCart(fullscreenImage, fullscreenQty);
                    setFullscreenImage(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-lg whitespace-nowrap"
                >
                  <span>🛒 Add ({fullscreenQty})</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal Checkout Success Responsif */}
      {checkoutSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative ${
            isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          }`}>
            <div className="text-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl sm:text-2xl">
                ✓
              </div>
              <h3 className="text-lg sm:text-xl font-black">Pesanan Berhasil Disiapkan!</h3>
            </div>

            <div className="border dark:border-gray-800 rounded-xl divide-y dark:divide-gray-800 max-h-52 overflow-y-auto mb-4 bg-gray-50 dark:bg-gray-950">
              {checkoutSummary.items.map((item) => (
                <div key={item.id} className="p-2.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-9 h-9 object-cover rounded-md border dark:border-gray-800" />
                    <div>
                      <p className="font-semibold leading-tight truncate max-w-[130px] sm:max-w-none">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">Rp {formatPrice(item.price)} x {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs">Rp {formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 flex justify-between items-center mb-5">
              <span className="text-xs sm:text-sm font-bold">Total Pembayaran:</span>
              <span className="text-sm sm:text-base font-black text-indigo-500">Rp {formatPrice(checkoutSummary.total)}</span>
            </div>

            <button
              onClick={() => setCheckoutSummary(null)}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}

      {/* POP-UP CHAT WIDGET Responsif */}
      <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center text-xl sm:text-2xl transition hover:scale-105 relative"
            title="Tanya CS"
          >
            💬
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </button>
        ) : (
          <div className={`w-[88vw] max-w-xs sm:max-w-none sm:w-96 rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 ${
            isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            {/* Header Chat */}
            <div className="bg-indigo-600 text-white p-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-indigo-800 flex items-center justify-center text-[10px] font-bold">
                    CS
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-indigo-600 rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold leading-tight">Customer Care</h4>
                  <p className="text-[9px] sm:text-[10px] text-indigo-200">Online | Balas Cepat</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Area Pesan */}
            <div className={`p-3 h-60 sm:h-72 overflow-y-auto space-y-2.5 text-xs ${
              isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
            }`}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 sm:p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : isDarkMode 
                          ? 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700' 
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className={`p-2.5 border-t flex gap-2 ${
              isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
            }`}>
              <input
                type="text"
                placeholder="Tulis pesan..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className={`flex-1 text-xs px-3 py-2 rounded-xl border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 border-gray-200 text-gray-800'
                }`}
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition"
              >
                Kirim
              </button>
            </form>
          </div>
        )}
      </div>

      <FooterStore/>
    </div>
  );
}