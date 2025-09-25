# How to Add Images in Election Articles

## 🖼️ Inline Images in Articles

You can easily add images anywhere within your election articles using the `ArticleImage` component. Here's how:

### Basic Usage

```tsx
<ArticleImage
  src="/election/inline/your-image.png"
  alt="Description of the image"
  caption="Optional caption for the image"
  credit="Source or photographer name"
  type="chart" // chart, photo, infographic, map, diagram
  size="medium" // small, medium, large, full
  align="center" // left, center, right
/>
```

### Image Types

- **chart**: For data visualizations and graphs
- **photo**: For photographs and real images
- **infographic**: For informational graphics
- **map**: For geographic visualizations
- **diagram**: For flowcharts and technical diagrams

### Size Options

- **small**: Max width 384px (24rem)
- **medium**: Max width 512px (32rem) - Default
- **large**: Max width 768px (48rem)
- **full**: Full width of container

### Alignment Options

- **left**: Align to the left
- **center**: Center aligned - Default
- **right**: Align to the right

### Advanced Features

```tsx
<ArticleImage
  src="/election/inline/complex-chart.png"
  alt="Complex data visualization"
  caption="Detailed analysis of voting patterns across different demographics"
  credit="LocalHub Analytics Team"
  type="chart"
  size="large"
  align="center"
  downloadUrl="/election/data/raw-data.xlsx"
  externalUrl="https://example.com/detailed-analysis"
/>
```

### Example: Adding Images Between Content Sections

```tsx
{/* Article content section */}
<div className="prose prose-lg max-w-none">
  <h2>Age Distribution Analysis</h2>
  <p>Our research shows significant trends in voter demographics...</p>
</div>

{/* Inline image after age analysis */}
<div className="my-8">
  <ArticleImage
    src="/election/inline/age-distribution-chart.png"
    alt="Age distribution chart"
    caption="Voter age distribution showing youth participation trends"
    credit="Census 2021"
    type="chart"
    size="large"
  />
</div>

{/* Continue with more content */}
<div className="prose prose-lg max-w-none">
  <h2>Gender Participation</h2>
  <p>The gender gap in voter registration has narrowed...</p>
</div>
```

### Best Practices

1. **Use descriptive alt text** for accessibility
2. **Add meaningful captions** that explain the image
3. **Credit your sources** when using external data
4. **Choose appropriate sizes** - don't make images too large for mobile
5. **Use the right type** for better visual organization
6. **Provide download links** for data visualizations

### File Organization

Store your images in:
```
public/election/
├── inline/           # Images that go within articles
│   ├── charts/       # Data visualizations
│   ├── photos/       # Photographs
│   ├── maps/         # Geographic visualizations
│   └── infographics/ # Informational graphics
├── charts/           # Main article charts
└── reports/          # PDF reports
```

### Responsive Images

The `ArticleImage` component automatically handles:
- Responsive sizing
- Mobile optimization
- Proper aspect ratios
- Loading optimization

### Adding Multiple Images

You can add as many images as needed throughout your article:

```tsx
{/* First image */}
<ArticleImage src="/election/inline/image1.png" alt="First image" />

{/* More content */}
<div className="prose prose-lg max-w-none">
  <p>More article content...</p>
</div>

{/* Second image */}
<ArticleImage src="/election/inline/image2.png" alt="Second image" />
```

This system gives you complete flexibility to add images anywhere in your articles with professional styling and proper organization!
