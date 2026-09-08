import React, { useState } from 'react';

// ==========================================
// UTILS: Helper Function untuk Format Harga
// ==========================================
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '0';
  return new Intl.NumberFormat('id-ID').format(price);
};

export default function HomeStore({ products = [] }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart Handlers
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
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

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-black tracking-tight text-gray-900">LOS BRAND</h1>
            {/* Tombol Home Baru */}
            <a
              href="/"
              className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </a>
          </div>
          {/* Ruang kosong penyeimbang layout header */}
          <div className="w-24"></div>
        </div>
      </header>

      {/* Floating Cart Button & Drawer (Gantung di Pojok Kanan Atas) */}
      <div className="fixed top-3 right-4 z-40 flex flex-col items-end">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative bg-gray-900 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition shadow-lg flex items-center gap-2 border border-gray-700"
        >
          <span>🛒 Cart</span>
          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            {totalItems}
          </span>
        </button>

        {/* Floating Cart Drawer Popup */}
        {isCartOpen && (
          <div className="mt-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xl w-80 sm:w-96 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-base font-bold text-gray-900">Your Shopping Cart</h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">Your cart is empty.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1 mb-4">
                  {cart.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between items-center text-sm">
                      <div className="flex-1 pr-2">
                        <span className="font-medium block text-gray-800">{item.name}</span>
                        <span className="text-gray-500 text-xs">Rp {formatPrice(item.price)} x {item.qty}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">Rp {formatPrice(item.price * item.qty)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                          title="Hapus Produk"
                        >
                          Hapus
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-3 flex justify-between font-bold text-base mb-4">
                  <span>Total:</span>
                  <span className="text-indigo-600">Rp {formatPrice(totalPrice)}</span>
                </div>
                <button className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700 transition text-sm shadow">
                  Checkout Now
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-white py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30">
              New Apparel Collection 2026
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Simple Style, Premium Quality.
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Temukan pakaian bergaya minimalis modern dengan potongan presisi dan bahan premium berkualitas tinggi.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Store Profile Section */}
        <section className="bg-white border rounded-2xl p-6 mb-10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=200"
            alt="LOS BRAND Official"
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-600 shadow-sm"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-gray-900">LOS BRAND Official Store</h3>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full self-center sm:self-auto">
                Verified Store
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-3">
              Semarang, Jawa Tengah • Menyediakan pakaian kasual dan streetwear premium harian.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-gray-600 font-medium">
              <div><strong className="text-gray-900">4.9/5</strong> Rating Toko</div>
              <div>•</div>
              <div><strong className="text-gray-900">100%</strong> Produk Original</div>
              <div>•</div>
              <div><strong className="text-gray-900">&lt; 24 Jam</strong> Pengiriman</div>
            </div>
          </div>
        </section>

        {/* Featured Products Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="relative group cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:opacity-90 transition" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                    <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      Quick View
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg text-gray-900">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                  <p className="text-indigo-600 font-bold mt-1">Rp {formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-white/80 rounded-full p-2 text-gray-500 hover:text-gray-800 z-10 font-bold"
            >
              ✕
            </button>

            <div className="p-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-md">
                {selectedProduct.category || 'Apparel'}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">{selectedProduct.name}</h3>
              <p className="text-lg font-bold text-indigo-600 mt-1">
                Rp {formatPrice(selectedProduct.price)}
              </p>
              
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                Detail kaos berbahan cotton premium yang nyaman dipakai harian dengan potongan reguler modern.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition text-sm"
                >
                  Tambah ke Keranjang
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}