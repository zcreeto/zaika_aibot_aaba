import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Flame } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

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
import masalaDosaImg from '@/assets/masala-dosa.jpg';
import sambarImg from '@/assets/sambar.jpg';
import rasamImg from '@/assets/rasam.jpg';
import avialImg from '@/assets/avial.jpg';
import pongalImg from '@/assets/pongal.jpg';
import prawnCurryImg from '@/assets/prawn-curry.jpg';
import koriGassiImg from '@/assets/kori-gassi.jpg';
import meenPollichathuImg from '@/assets/meen-pollichathu.jpg';
import sundalImg from '@/assets/sundal.jpg';
import tamarindRiceImg from '@/assets/tamarind-rice.jpg';
import mysorePakImg from '@/assets/mysore-pak.jpg';
import kozhukattaImg from '@/assets/kozhukatta.jpg';
import thalasseryBiryaniImg from '@/assets/thalassery-biryani.jpg';
import andhraBiryaniImg from '@/assets/andhra-biryani.jpg';
import chettinadBiryaniImg from '@/assets/chettinad-biryani.jpg';
import dindigulBiryaniImg from '@/assets/dindigul-biryani.jpg';
import amburBiryaniImg from '@/assets/ambur-biryani.jpg';
import mangaloreBiryaniImg from '@/assets/mangalore-biryani.jpg';
import pakkiBiryaniImg from '@/assets/pakki-biryani.jpg';
import bearyBiryaniImg from '@/assets/beary-biryani.jpg';
import donneBiryaniImg from '@/assets/donne-biryani.jpg';

const imageMap: Record<string, string> = {
  dosa: dosaImg,
  'masala-dosa': masalaDosaImg,
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
  sambar: sambarImg,
  rasam: rasamImg,
  avial: avialImg,
  pongal: pongalImg,
  'prawn-curry': prawnCurryImg,
  'kori-gassi': koriGassiImg,
  'meen-pollichathu': meenPollichathuImg,
  sundal: sundalImg,
  'tamarind-rice': tamarindRiceImg,
  'mysore-pak': mysorePakImg,
  kozhukatta: kozhukattaImg,
  'thalassery-biryani': thalasseryBiryaniImg,
  'andhra-biryani': andhraBiryaniImg,
  'chettinad-biryani': chettinadBiryaniImg,
  'dindigul-biryani': dindigulBiryaniImg,
  'ambur-biryani': amburBiryaniImg,
  'mangalore-biryani': mangaloreBiryaniImg,
  'pakki-biryani': pakkiBiryaniImg,
  'beary-biryani': bearyBiryaniImg,
  'donne-biryani': donneBiryaniImg,
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const imageSrc = imageMap[product.image] || dosaImg;

  const getSpiceLevelColor = (level?: string) => {
    switch (level) {
      case 'hot':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'mild':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-soft animate-fade-in flex flex-col h-full">
      <div className="relative overflow-hidden h-48">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {product.isVeg && (
            <Badge variant="secondary" className="bg-secondary/90">
              Veg
            </Badge>
          )}
          {product.spiceLevel && (
            <Badge variant={getSpiceLevelColor(product.spiceLevel)} className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {product.spiceLevel}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">₹{product.price}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
