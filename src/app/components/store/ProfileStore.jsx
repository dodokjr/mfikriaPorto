import React from 'react'


export default function ProfileStore(){
    return(
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
    )
}