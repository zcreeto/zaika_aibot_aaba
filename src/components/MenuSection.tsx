import { useState } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface MenuSectionProps {
  title: string;
  products: Product[];
  id?: string;
  showFilters?: boolean;
}

export const MenuSection = ({ title, products, id, showFilters = false }: MenuSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterSpice, setFilterSpice] = useState<string | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const categories = Array.from(new Set(products.map(p => p.category)));
  const spiceLevels = ['mild', 'medium', 'hot'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesVeg = !filterVeg || product.isVeg;
    const matchesSpice = !filterSpice || product.spiceLevel === filterSpice;
    return matchesSearch && matchesCategory && matchesVeg && matchesSpice;
  });

  return (
    <section 
      id={id} 
      className="py-12 md:py-20 bg-gradient-spice"
    >
      <div className="container mx-auto px-4" ref={ref}>
        <div className={`transition-all duration-700 ${isVisible ? 'fade-in-scroll' : 'opacity-0'}`}>
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-3 md:mb-4">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-warm mx-auto mb-8 md:mb-12" />

        {showFilters && (
          <div className="mb-8 space-y-4 animate-fade-in">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category.replace('-', ' ')}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={filterVeg ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilterVeg(!filterVeg)}
              >
                Veg Only
              </Button>
              {spiceLevels.map(level => (
                <Button
                  key={level}
                  variant={filterSpice === level ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => setFilterSpice(filterSpice === level ? null : level)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No dishes found matching your filters.</p>
          </div>
        )}
        </div>
      </div>
    </section>
  );
};
