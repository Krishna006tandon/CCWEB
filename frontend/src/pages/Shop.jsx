import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-cream/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brown mb-6 tracking-tight">Culinary Shop</h1>
          <p className="text-base sm:text-xl text-brown/60 font-light max-w-2xl mx-auto">
            Professional-grade kitchen essentials curated by our master chefs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <div 
              key={product._id}
              className="premium-card p-4 flex flex-col group bg-white/60 backdrop-blur-xl"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-square mb-6">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {product.stock <= 5 && (
                  <span className="absolute top-4 right-4 bg-peach text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Low Stock
                  </span>
                )}
              </div>
              
              <div className="flex flex-col flex-grow px-2">
                <h3 className="text-lg font-bold text-brown mb-2">{product.name}</h3>
                <p className="text-sm text-brown/60 mb-6 line-clamp-2 leading-relaxed h-10">
                  {product.description}
                </p>
                
                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-beige/60">
                  <span className="text-2xl font-bold text-sage">Rs. {product.price}</span>
                  <button className="bg-brown text-white hover:bg-brown/80 px-5 py-2.5 rounded-full font-medium text-xs transition-colors shadow-sm uppercase tracking-widest w-full sm:w-auto">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-brown/40 italic">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
