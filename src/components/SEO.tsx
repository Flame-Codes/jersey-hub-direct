import { Helmet } from 'react-helmet-async';
import { Product } from '@/types/product';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  product?: Product;
}

const SEO = ({
  title = 'JerseyStore - Premium Football Jerseys | Authentic Quality',
  description = 'Shop authentic football jerseys from top clubs and national teams. Quality guaranteed, fast delivery across Bangladesh. Cash on Delivery available.',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  product,
}: SEOProps) => {
  const siteName = 'JerseyStore';

  // Generate product structured data if product is provided
  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || description,
        image: product.image,
        brand: {
          '@type': 'Brand',
          name: product.category,
        },
        offers: {
          '@type': 'Offer',
          price: product.price * (1 - product.discount / 100),
          priceCurrency: 'BDT',
          availability: product.stock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      }
    : null;

  // Website structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: typeof window !== 'undefined' ? window.location.origin : '',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${typeof window !== 'undefined' ? window.location.origin : ''}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  // Organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: typeof window !== 'undefined' ? window.location.origin : '',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+8801952081184',
      contactType: 'customer service',
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={product ? 'product' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      {productSchema && (
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
