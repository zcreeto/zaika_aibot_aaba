import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Image imports
import dosaImg from '@/assets/dosa.jpg';
import idliImg from '@/assets/idli.jpg';
import hyderabadiBiryaniImg from '@/assets/hyderabadi-biryani.jpg';
import meduVadaImg from '@/assets/medu-vada.jpg';
import uttapamImg from '@/assets/uttapam.jpg';
import fishMoleeImg from '@/assets/fish-molee.jpg';
import chettinadChickenImg from '@/assets/chettinad-chicken.jpg';
import payasamImg from '@/assets/payasam.jpg';
import kolkataBiryaniImg from '@/assets/kolkata-biryani.jpg';
import appamImg from '@/assets/appam.jpg';
import puttuImg from '@/assets/puttu.jpg';
import upmaImg from '@/assets/upma.jpg';
import chicken65Img from '@/assets/chicken-65.jpg';
import parottaImg from '@/assets/parotta.jpg';
import lemonRiceImg from '@/assets/lemon-rice.jpg';
import bisiBeleBathImg from '@/assets/bisi-bele-bath.jpg';

const imageMap: Record<string, string> = {
  dosa: dosaImg,
  idli: idliImg,
  'hyderabadi-biryani': hyderabadiBiryaniImg,
  'medu-vada': meduVadaImg,
  uttapam: uttapamImg,
  'fish-molee': fishMoleeImg,
  'chettinad-chicken': chettinadChickenImg,
  payasam: payasamImg,
  'kolkata-biryani': kolkataBiryaniImg,
  appam: appamImg,
  puttu: puttuImg,
  upma: upmaImg,
  'chicken-65': chicken65Img,
  parotta: parottaImg,
  'lemon-rice': lemonRiceImg,
  'bisi-bele-bath': bisiBeleBathImg,
};

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const deliveryFee = 40;
  const subtotal = getTotalPrice();
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background pt-16">
          <div className="text-center animate-fade-in">
            <ShoppingBag className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some delicious South Indian dishes!</p>
            <Link to="/">
              <Button size="lg">Browse Menu</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold">Your Cart</h1>
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const imageSrc = imageMap[item.image] || dosaImg;
                return (
                  <Card key={item.id} className="animate-fade-in">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">
                              ₹{item.price}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 animate-fade-in">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-semibold">₹{deliveryFee}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">₹{total}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      size="lg"
                      onClick={() => navigate('/checkout')}
                    >
                      Proceed to Checkout
                    </Button>
                    <Link to="/">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
