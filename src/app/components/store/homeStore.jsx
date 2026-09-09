import React, { useState, useEffect, useRef } from 'react';
import FooterStore from './FooterStore';
import NavbarStore from "./NavbarStore.jsx";
import AboutMe from "./AboutMe.jsx";
import FeedbackStore from "./FeedbackStore.jsx";

// ==========================================
// UTILS: Helper Function untuk Format Harga
// ==========================================
export const formatPrice = (price) => {
  if (price === undefined || price === null) return '0';
  return new Intl.NumberFormat('id-ID').format(price);
};

export default function HomeStore({ products = [] }) {
  // Force default to dark mode for the true Starboy look, but keep toggle capability
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const [checkoutSummary, setCheckoutSummary] = useState(null);

  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fullscreenQty, setFullscreenQty] = useState(1);
  const [detailQty, setDetailQty] = useState(1);

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'LOS BRAND // System online. State your inquiry.' }
  ]);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Transmission received. Support unit will establish connection shortly.'
        }
      ]);
    }, 1000);
  };

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
    <div className={`min-h-screen font-sans tracking-tight transition-colors duration-500 relative ${isDarkMode ? 'bg-[#0a0a0c] text-neutral-100 selection:bg-neutral-100 selection:text-black' : 'bg-neutral-50 text-neutral-900 selection:bg-black selection:text-white'}`}>
      
      {/* Navbar Integration */}
      <NavbarStore 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        totalItems={totalItems} 
        setIsCartOpen={setIsCartOpen} 
      />

      {/* Floating Cart Button */}
      <div className="fixed top-3 right-3 sm:right-6 z-40 flex flex-col items-end">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className={`relative px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider backdrop-blur-md transition-all duration-300 flex items-center gap-2 border ${
            isDarkMode 
              ? 'bg-neutral-900/80 border-neutral-800 text-white hover:border-neutral-600 shadow-[0_0_20px_rgba(0,0,0,0.8)]' 
              : 'bg-white/80 border-neutral-200 text-neutral-900 hover:border-neutral-400 shadow-lg'
          }`}
        >
          <span className="text-[10px]">⚡</span>
          <span>Cart</span>
          <span className="bg-white text-black dark:bg-neutral-100 dark:text-black text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {totalItems}
          </span>
        </button>

        {isCartOpen && (
          <div className={`mt-2 border rounded-xl p-4 sm:p-5 shadow-2xl w-[90vw] max-w-xs sm:w-96 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
            isDarkMode ? 'bg-neutral-950/95 border-neutral-800 text-neutral-100' : 'bg-white/95 border-neutral-200 text-neutral-900'
          }`}>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-neutral-800/40">
              <h3 className="text-xs uppercase font-mono tracking-widest text-neutral-400">Bag // {totalItems} items</h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-500 hover:text-white text-xs font-mono transition"
              >
                [ESC]
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-neutral-500 text-xs font-mono text-center py-8">Bag is currently empty.</p>
            ) : (
              <>
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-neutral-800/40">
                  <input
                    type="checkbox"
                    id="select-all"
                    checked={cart.length > 0 && selectedCartIds.length === cart.length}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 accent-white rounded bg-transparent border-neutral-700 cursor-pointer"
                  />
                  <label htmlFor="select-all" className="text-[11px] font-mono text-neutral-400 cursor-pointer select-none">
                    Select All ({selectedCartIds.length}/{cart.length})
                  </label>
                </div>

                <ul className="divide-y divide-neutral-900 max-h-60 overflow-y-auto pr-1 mb-3 space-y-2">
                  {cart.map((item) => {
                    const isChecked = selectedCartIds.includes(item.id);

                    return (
                      <li key={item.id} className="pt-2 flex gap-3 items-center text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectCartItem(item.id)}
                          className="w-3.5 h-3.5 accent-white rounded bg-transparent border-neutral-700 cursor-pointer"
                        />

                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-11 h-11 object-cover rounded-md border border-neutral-800 flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <span className="font-medium block truncate text-xs">{item.name}</span>
                          <span className="text-neutral-500 font-mono text-[10px]">Rp {formatPrice(item.price)}</span>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded text-[10px] font-mono hover:border-neutral-600 transition"
                            >
                              -
                            </button>
                            <span className="text-[11px] font-mono">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded text-[10px] font-mono hover:border-neutral-600 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="font-mono text-xs font-semibold">
                            Rp {formatPrice(item.price * item.qty)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-500 hover:text-red-400 font-mono text-[10px] transition"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-neutral-800/60 pt-3 flex justify-between font-mono text-xs mb-3">
                  <span className="text-neutral-400">Total:</span>
                  <span className="font-bold">Rp {formatPrice(selectedTotalPrice)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className={`w-full py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition ${
                    selectedItems.length > 0 
                      ? 'bg-white text-black hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                      : 'bg-neutral-900 text-neutral-600 cursor-not-allowed border border-neutral-800'
                  }`}
                >
                  Proceed to Checkout ({selectedItems.length})
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hero Section - Starboy Cinematic Vibe */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4 border-b border-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LOS BRAND // Fall-Winter Archive
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase">
            No Rules. Pure Form.
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md font-mono">
            Minimalist architecture translated into wearable heavy-weight apparel. Designed for the nocturnal aesthetic.
          </p>
        </div>
      </section>

      {/* Main Content Products */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs uppercase font-mono tracking-widest text-neutral-400">Catalog // Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products?.map((product) => {
            const itemQty = getItemQtyInCart(product.id);

            return (
              <div 
                key={product.id} 
                className={`group border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                  isDarkMode ? 'bg-neutral-950 border-neutral-900 hover:border-neutral-700' : 'bg-white border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div>
                  <div 
                    className="relative cursor-pointer overflow-hidden bg-neutral-900 aspect-[4/5]" 
                    onClick={() => {
                      setFullscreenImage(product);
                      setFullscreenQty(1);
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition backdrop-blur-[2px]">
                      <span className="border border-white/20 bg-black/60 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full shadow backdrop-blur-md">
                        View Item
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">{product.category}</span>
                    <h3 className="font-medium text-sm sm:text-base tracking-tight truncate">{product.name}</h3>
                    <p className="font-mono font-semibold text-xs text-neutral-200">Rp {formatPrice(product.price)}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-2">
                  <div className="relative">
                    {itemQty > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-black dark:bg-white dark:text-black text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow z-10">
                        {itemQty}
                      </span>
                    )}
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full bg-neutral-900 hover:bg-white hover:text-black text-white border border-neutral-800 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-300"
                    >
                      + Add
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setDetailQty(1);
                    }}
                    className="w-full py-2 rounded-lg font-mono text-[11px] uppercase tracking-wider text-neutral-400 hover:text-white transition bg-transparent hover:bg-neutral-900"
                  >
                    Quick View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative border ${
            isDarkMode ? 'bg-neutral-950 border-neutral-800 text-neutral-100' : 'bg-white border-neutral-200 text-neutral-900'
          }`}>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white w-8 h-8 rounded-full flex items-center justify-center z-10 font-mono text-xs"
            >
              ✕
            </button>

            <div className="p-5 sm:p-6 space-y-4">
              <div 
                className="relative cursor-pointer rounded-xl overflow-hidden aspect-square bg-neutral-900"
                onClick={() => {
                  setFullscreenImage(selectedProduct);
                  setFullscreenQty(detailQty);
                }}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  {selectedProduct.category || 'Apparel'}
                </span>
                <h3 className="text-base sm:text-lg font-semibold">{selectedProduct.name}</h3>
                <p className="font-mono text-sm text-neutral-300">
                  Rp {formatPrice(selectedProduct.price)}
                </p>
              </div>

              <p className="text-neutral-400 text-xs font-mono leading-relaxed">
                Heavyweight combed cotton, custom minimalist typography print, relaxed structured silhouette.
              </p>

              <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">Quantity:</span>
                <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
                  <button
                    onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                    className="w-6 h-6 flex items-center justify-center bg-neutral-800 rounded font-mono text-xs"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs w-4 text-center">{detailQty}</span>
                  <button
                    onClick={() => setDetailQty((prev) => prev + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-neutral-800 rounded font-mono text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, detailQty);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 bg-white text-black hover:bg-neutral-200 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition font-bold"
                >
                  Add to Cart ({detailQty})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Fullscreen View */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full h-full max-w-4xl flex flex-col items-center justify-between py-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex justify-end">
              <button
                onClick={() => setFullscreenImage(null)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white w-10 h-10 rounded-full font-mono flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center my-auto overflow-hidden py-2">
              <img 
                src={fullscreenImage.image} 
                alt={fullscreenImage.name} 
                className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-neutral-900" 
              />
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-3 text-white backdrop-blur-md shadow-2xl">
              <div className="text-center sm:text-left">
                <h4 className="font-medium text-xs tracking-tight truncate max-w-[200px]">{fullscreenImage.name}</h4>
                <p className="font-mono text-xs text-neutral-400 mt-0.5">Rp {formatPrice(fullscreenImage.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
                  <button
                    onClick={() => setFullscreenQty((prev) => Math.max(1, prev - 1))}
                    className="w-6 h-6 flex items-center justify-center bg-neutral-800 rounded font-mono text-xs"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs w-4 text-center">{fullscreenQty}</span>
                  <button
                    onClick={() => setFullscreenQty((prev) => prev + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-neutral-800 rounded font-mono text-xs"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => {
                    addToCart(fullscreenImage, fullscreenQty);
                    setFullscreenImage(null);
                  }}
                  className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition font-bold"
                >
                  Add ({fullscreenQty})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      {checkoutSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="rounded-2xl max-w-md w-full p-6 shadow-2xl relative border bg-neutral-950 border-neutral-800 text-neutral-100">
            <div className="text-center mb-4 space-y-2">
              <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 text-white rounded-full flex items-center justify-center mx-auto text-sm font-mono">
                ✓
              </div>
              <h3 className="text-base font-semibold tracking-tight">Order Confirmed</h3>
              <p className="text-[11px] font-mono text-neutral-500">Transmission sequence finalized successfully.</p>
            </div>

            <div className="border border-neutral-900 rounded-xl divide-y divide-neutral-900 max-h-48 overflow-y-auto mb-4 bg-neutral-900/30">
              {checkoutSummary.items.map((item) => (
                <div key={item.id} className="p-2.5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded border border-neutral-800" />
                    <div>
                      <p className="font-medium truncate max-w-[120px]">{item.name}</p>
                      <p className="text-[10px] text-neutral-500">Rp {formatPrice(item.price)} × {item.qty}</p>
                    </div>
                  </div>
                  <span>Rp {formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-3 flex justify-between items-center mb-4 font-mono text-xs">
              <span className="text-neutral-400">Total Settlement:</span>
              <span className="font-bold">Rp {formatPrice(checkoutSummary.total)}</span>
            </div>

            <button
              onClick={() => setCheckoutSummary(null)}
              className="w-full bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase tracking-wider py-2.5 rounded-lg transition font-bold"
            >
              Close Terminal
            </button>
          </div>
        </div>
      )}

      {/* Minimalist Futuristic Chat Widget */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition hover:scale-105 relative"
            title="Open Support Terminal"
          >
            <span className="font-mono text-xs">_</span>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-black"></span>
          </button>
        ) : (
          <div className="w-[88vw] max-w-xs sm:w-80 rounded-xl shadow-2xl border bg-neutral-950 border-neutral-800 text-neutral-100 flex flex-col overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-neutral-900 border-b border-neutral-800 p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h4 className="text-[11px] font-mono tracking-widest uppercase">Support // Terminal</h4>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-neutral-500 hover:text-white font-mono text-xs"
              >
                [X]
              </button>
            </div>

            <div className="p-3 h-60 overflow-y-auto space-y-2.5 font-mono text-xs bg-black/40">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-white text-black font-medium'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-300'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-900 bg-neutral-950 flex gap-2">
              <input
                type="text"
                placeholder="Type command..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 font-mono text-xs px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600"
              />
              <button
                type="submit"
                className="bg-white text-black hover:bg-neutral-200 px-3 py-2 rounded-lg font-mono text-xs font-bold transition"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      <AboutMe isDarkMode={isDarkMode} />
      <FeedbackStore isDarkMode={isDarkMode} />
      <FooterStore isDarkMode={isDarkMode} />
    </div>
  );
}