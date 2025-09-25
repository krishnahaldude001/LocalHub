import { Metadata } from 'next'
import ArticleImage from '@/components/article-image'

export const metadata: Metadata = {
  title: 'Example: Adding Images to Articles | LocalHub',
  description: 'Learn how to add images anywhere in your election articles.',
}

export default function ExampleArticlePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Example: Adding Images to Articles</h1>
      
      <div className="prose prose-lg max-w-none">
        <h2>Understanding Voter Demographics</h2>
        <p>
          This is a sample article showing how you can add images anywhere within your content. 
          The images will be properly styled and responsive.
        </p>
      </div>

      {/* Example 1: Chart Image */}
      <ArticleImage
        src="/election/inline/voter-registration-trends.png"
        alt="Voter registration trends chart"
        caption="Voter registration trends showing significant growth in youth participation (2019-2025)"
        credit="Election Commission of India"
        type="chart"
        size="large"
        downloadUrl="/election/data/voter-registration-trends.xlsx"
      />

      <div className="prose prose-lg max-w-none">
        <h2>Community Distribution Analysis</h2>
        <p>
          The geographic distribution of different communities plays a crucial role in understanding 
          voting patterns. Our analysis shows interesting trends across the target areas.
        </p>
      </div>

      {/* Example 2: Map Image */}
      <ArticleImage
        src="/election/inline/community-distribution-map.png"
        alt="Community distribution map"
        caption="Geographic distribution of different communities across Govandi, Shivaji Nagar, and Baiganwadi"
        credit="Census 2021 Data"
        type="map"
        size="full"
      />

      <div className="prose prose-lg max-w-none">
        <h2>Gender Gap Reduction</h2>
        <p>
          One of the most positive trends we've observed is the significant reduction in the gender gap 
          in voter registration. This represents a major step forward in democratic participation.
        </p>
      </div>

      {/* Example 3: Infographic */}
      <ArticleImage
        src="/election/inline/gender-gap-reduction.png"
        alt="Gender gap reduction infographic"
        caption="Historical comparison showing the reduction in gender gap in voter registration from 2019 to 2025"
        credit="LocalHub Analytics"
        type="infographic"
        size="medium"
        align="center"
      />

      <div className="prose prose-lg max-w-none">
        <h2>Small Image Example</h2>
        <p>
          You can also use smaller images for specific data points or supporting information.
        </p>
      </div>

      {/* Example 4: Small Image */}
      <ArticleImage
        src="/election/inline/small-data-point.png"
        alt="Small data visualization"
        caption="Key statistics summary"
        credit="LocalHub Data"
        type="diagram"
        size="small"
        align="left"
      />

      <div className="prose prose-lg max-w-none">
        <h2>Conclusion</h2>
        <p>
          As you can see, you can easily add images anywhere in your articles with different sizes, 
          types, and alignments. The ArticleImage component handles all the styling and responsive behavior automatically.
        </p>
      </div>
    </div>
  )
}
