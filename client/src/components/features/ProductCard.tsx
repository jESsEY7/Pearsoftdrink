import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/features/Toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <GlassCard className="group hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-semibold
            ${product.category === 'energy' 
              ? 'bg-orange-500 text-white' 
              : 'bg-blue-500 text-white'
            }
          `}>
            {product.category === 'energy' ? 'Energy' : 'Soft Drink'}
          </span>
        </div>
        
        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {product.name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-green-500">
              KSh {product.price}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.volume}
            </p>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </GlassCard>
  );
}
