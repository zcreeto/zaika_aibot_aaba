import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

const OrderSuccess = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-background pt-16">
        <div className="text-center max-w-md animate-scale-in">
          <CheckCircle className="w-24 h-24 mx-auto mb-6 text-secondary" />
          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. We'll start preparing your delicious South Indian meal right away!
            You'll receive updates on your phone.
          </p>
          <div className="space-y-4">
            <Link to="/">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
