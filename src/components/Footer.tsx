import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { WHATSAPP_DISPLAY_NUMBER } from '@/utils/telegram';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    toast({
      title: 'Subscribed!',
      description: 'Thank you for subscribing to our newsletter.',
    });
    setEmail('');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      {/* Newsletter Section */}
      <div className="gradient-gold py-12">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-3xl text-primary-foreground">
              Stay Updated
            </h3>
            <p className="mt-2 text-primary-foreground/80">
              Subscribe to get updates on new arrivals and exclusive offers
            </p>
            <form onSubmit={handleNewsletter} className="mt-6 flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                required
              />
              <Button type="submit" variant="secondary" size="lg">
                <Send className="h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-gold">
                  <ShoppingBag className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl tracking-wide text-foreground">
                  JERSEY<span className="text-primary">STORE</span>
                </span>
              </a>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Your trusted destination for authentic football jerseys. Quality guaranteed, fast delivery across Bangladesh.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-lg text-foreground">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    New Arrivals
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Best Sellers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    On Sale
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-display text-lg text-foreground">Categories</h4>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Club Jerseys
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    National Teams
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Retro Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Training Wear
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-lg text-foreground">Contact Us</h4>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  {WHATSAPP_DISPLAY_NUMBER}
                </li>
                <li className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  contact@jerseystore.com
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Dhaka, Bangladesh
                </li>
              </ul>

              {/* Social Links */}
              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-6">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} JerseyStore. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
