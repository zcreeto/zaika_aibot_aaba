export interface Product {
  id: string;
  name: string;
  category: 'breakfast' | 'main-course' | 'biryani' | 'dessert' | 'rice' | 'appetizer';
  price: number;
  image: string;
  description: string;
  isVeg: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot';
}

export interface CartItem extends Product {
  quantity: number;
}
