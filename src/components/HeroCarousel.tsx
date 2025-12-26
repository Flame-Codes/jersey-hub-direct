import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shirt, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import heroBg from '@/assets/hero-bg.jpg';

const slides = [
  {
    id: 1,
    title: 'Premium Football Jerseys',
    subtitle: 'Authentic Quality, Unbeatable Prices',
    cta: 'Shop Now',
    gradient: 'from-primary/20 via-transparent to-transparent',
  },
  {
    id: 2,
    title: 'New Season Collection',
    subtitle: '25/26 Season Kits Now Available',
    cta: 'Explore',
    gradient: 'from-blue-600/20 via-transparent to-transparent',
  },
  {
    id: 3,
    title: 'Retro Collection',
    subtitle: 'Classic Jerseys from Legendary Seasons',
    cta: 'Discover',
    gradient: 'from-emerald-600/20 via-transparent to-transparent',
  },
];

const features = [
  { icon: Shirt, text: 'Authentic Quality' },
  { icon: Truck, text: 'Fast Delivery' },
  { icon: Shield, text: 'Trusted Service' },
];

interface HeroCarouselProps {
  onShopClick: () => void;
}

const HeroCarousel = ({ onShopClick }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="Football jerseys collection" 
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <div className="container relative py-16 md:py-24">
        {/* Slides */}
        <div className="relative min-h-[280px] md:min-h-[350px]">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700',
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              )}
            >
              {/* Gradient Overlay */}
              <div className={cn('absolute inset-0 bg-gradient-to-r', slide.gradient)} />

              <div className="relative z-10 max-w-3xl px-4">
                <h2 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wide text-foreground animate-slide-up">
                  {slide.title}
                </h2>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '100ms' }}>
                  {slide.subtitle}
                </p>
                <Button
                  variant="gold"
                  size="xl"
                  className="mt-8 animate-slide-up"
                  style={{ animationDelay: '200ms' }}
                  onClick={onShopClick}
                >
                  {slide.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground backdrop-blur hover:bg-secondary transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-foreground backdrop-blur hover:bg-secondary transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-border bg-card/50 backdrop-blur">
        <div className="container py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <feature.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
