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
    <footer className="border-t border-border bg-background">
      {/* Newsletter Section */}
      <div className="bg-foreground py-10">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-2xl text-background">
              Stay Updated
            </h3>
            <p className="mt-2 text-background/70 text-sm">
              Subscribe to get updates on new arrivals and exclusive offers
            </p>
            <form onSubmit={handleNewsletter} className="mt-5 flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50 rounded-full"
                required
              />
              <Button type="submit" className="bg-background text-foreground hover:bg-background/90 rounded-full px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-10">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <a href="/" className="flex items-center gap-1">
                <span className="font-display text-lg font-semibold text-foreground">JERSEY</span>
                <span className="font-display text-lg font-light text-muted-foreground">HUB</span>
              </a>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Your trusted destination for authentic football jerseys. Quality guaranteed.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-medium text-foreground text-sm">Quick Links</h4>
              <ul className="mt-3 space-y-2">
                <li><a href="#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">New Arrivals</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Best Sellers</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-medium text-foreground text-sm">Categories</h4>
              <ul className="mt-3 space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Club Jerseys</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">National Teams</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Retro Collection</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-medium text-foreground text-sm">Contact Us</h4>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {WHATSAPP_DISPLAY_NUMBER}
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  contact@jerseyhub.com
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  Dhaka, Bangladesh
                </li>
              </ul>

              {/* Social Links */}
              <div className="mt-4 flex gap-2">
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-4">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
            <p className="text-xs text-muted-foreground">
              © {currentYear} JerseyHub. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Refunds</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
