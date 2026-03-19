import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogUrl, 
  canonicalUrl,
  type = 'website'
}) => {
  const defaultTitle = 'Poonam Cooking and Baking Classes - Professional Culinary Training in Mumbai';
  const defaultDescription = 'Join Poonam Cooking and Baking Classes for professional culinary training. Learn cooking, baking, and catering from expert chefs. Enroll now for offline and online classes in Mumbai.';
  const defaultKeywords = 'poonam classes, poonam cooking classes, baking classes, poonam baking classes, cooking classes, culinary training, Mumbai, professional cooking, baking courses, catering classes, food classes, culinary school, chef training, poonam, cooking and baking classes';
  const defaultOgImage = '/about-logo.png';
  const baseUrl = 'https://poonamcookingclasses.com';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title || defaultTitle}</title>
      <meta name="title" content={title || defaultTitle} />
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || `${baseUrl}${ogUrl || ''}`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`${baseUrl}${ogUrl || ''}`} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Poonam Cooking and Baking Classes" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${baseUrl}${ogUrl || ''}`} />
      <meta property="twitter:title" content={title || defaultTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={ogImage || defaultOgImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
    </Helmet>
  );
};

export default SEO;
