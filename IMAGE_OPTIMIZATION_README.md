# Image Optimization Guide

This project includes comprehensive image optimization features to improve loading performance and user experience.

## 🚀 Features

### 1. OptimizedImage Component
- **Lazy loading** with Intersection Observer
- **WebP support** with automatic fallbacks
- **Loading states** with spinner
- **Error handling** with fallback UI
- **Responsive images** support

### 2. Image Optimization Utilities
- **useImageOptimization hook** for custom implementations
- **Responsive image generation** utilities
- **WebP conversion** tools

### 3. Build-time Optimizations
- **Vite configuration** optimized for images
- **Asset handling** for modern formats
- **Compression** and optimization settings

## 📖 Usage

### Basic OptimizedImage Usage

```jsx
import OptimizedImage from '../utils/OptimizedImage';

function MyComponent() {
  return (
    <OptimizedImage
      src="images/hero.jpg"
      alt="Hero image"
      className="hero-image"
      width="800"
      height="600"
      lazy={true}
    />
  );
}
```

### Advanced Usage with Responsive Images

```jsx
import OptimizedImage from '../utils/OptimizedImage';

function ResponsiveHero() {
  return (
    <OptimizedImage
      src="images/hero-large.jpg"
      srcSet="images/hero-small.webp 480w, images/hero-medium.webp 800w, images/hero-large.webp 1200w"
      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 800px, 1200px"
      alt="Responsive hero image"
      lazy={true}
    />
  );
}
```

### Using the Optimization Hook

```jsx
import { useImageOptimization } from '../utils/useImageOptimization';

function CustomImageComponent({ src, alt }) {
  const { src: optimizedSrc, isLoading, hasError } = useImageOptimization(src, alt);

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error loading image</div>;

  return <img src={optimizedSrc} alt={alt} />;
}
```

## 🛠️ Image Optimization Script

### Prerequisites
Install image optimization tools:
```bash
# For Ubuntu/Debian
sudo apt-get install webp imagemagick

# For macOS
brew install webp imagemagick

# For Windows
# Download from official websites
```

### Running the Optimization Script
```bash
# Optimize all images in public/images/
npm run optimize-images

# Or run directly
node scripts/optimize-images.js
```

### What the Script Does
1. **Scans** `public/images/` for image files
2. **Converts** images to WebP format
3. **Generates** responsive sizes (480px, 800px, 1200px, 1600px)
4. **Preserves** original images as fallbacks
5. **Reports** optimization results

## 📁 File Structure

```
src/
├── utils/
│   ├── OptimizedImage.jsx      # Main optimized image component
│   └── useImageOptimization.js # Hook for image optimization
scripts/
└── optimize-images.js          # Image optimization script
```

## 🎯 Performance Benefits

### Before Optimization
- ❌ Large image files
- ❌ No lazy loading
- ❌ No WebP support
- ❌ No responsive images

### After Optimization
- ✅ **30-50% smaller** file sizes with WebP
- ✅ **Lazy loading** reduces initial page load
- ✅ **Responsive images** for different screen sizes
- ✅ **Modern formats** with fallbacks
- ✅ **Loading states** improve UX
- ✅ **Error handling** for reliability

## 🔧 Configuration

### Vite Configuration
The Vite config includes optimizations for:
- Asset handling for WebP/AVIF
- Public directory management
- Build optimizations

### Environment Variables
Add to your `.env` file:
```env
# Image optimization settings
VITE_ENABLE_IMAGE_OPTIMIZATION=true
VITE_IMAGE_QUALITY=85
VITE_LAZY_LOADING_THRESHOLD=50
```

## 📱 Browser Support

- **Modern browsers**: WebP images with full optimization
- **Older browsers**: Automatic fallback to original formats
- **All browsers**: Progressive enhancement approach

## 🐛 Troubleshooting

### Images not loading
1. Check file paths in `public/images/`
2. Verify WebP conversion completed successfully
3. Check browser console for errors

### WebP not supported
- The component automatically falls back to original formats
- No action needed - graceful degradation

### Build errors
1. Ensure all dependencies are installed: `npm install`
2. Check Node.js version compatibility
3. Verify image file formats are supported

## 📈 Best Practices

1. **Always use OptimizedImage** for user-facing images
2. **Run optimization script** before deployment
3. **Test on different devices** and screen sizes
4. **Monitor Core Web Vitals** for image performance
5. **Use appropriate sizes** for different contexts

## 🔄 Migration Guide

### From Regular `<img>` Tags
```jsx
// Before
<img src="image.jpg" alt="Description" />

// After
<OptimizedImage
  src="image.jpg"
  alt="Description"
  lazy={true}
/>
```

### From `<picture>` Elements
```jsx
// Before
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>

// After
<OptimizedImage
  src="image.jpg"
  srcSet="image.webp 1x"
  alt="Description"
/>
```

## 📊 Metrics to Track

- **Largest Contentful Paint (LCP)**
- **Cumulative Layout Shift (CLS)**
- **First Input Delay (FID)**
- **Image load times**
- **Bundle size impact**

---

For more information, see the component documentation in the source files.