// backend/data.js

const articles = [
    {
      id: '1',
      title: 'Decoding the Latest RBI Policy Changes',
      summary: 'The Reserve Bank of India announced new measures this week aimed at controlling inflation and boosting liquidity. Here\'s a quick breakdown of what changed and what it means for you.',
      body: 'The Monetary Policy Committee (MPC) of the Reserve Bank of India (RBI) concluded its latest meeting today, announcing several key decisions. The repo rate was kept unchanged at 6.5%, a move largely anticipated by economists, signalling a continued focus on bringing inflation within the target band. The RBI also reiterated its commitment to supporting growth while maintaining price stability. Key takeaways include adjustments to standing deposit facility (SDF) and marginal standing facility (MSF) rates. Experts suggest this indicates a watchful approach by the central bank, closely monitoring global economic headwinds and domestic inflation trends. For the common person, an unchanged repo rate typically means stability in lending rates for home and auto loans, though banks might adjust their internal rates based on their cost of funds.',
      author: 'Finshots Team',
      publishedAt: '2025-06-12T10:00:00Z', // ISO 8601 format
      category: 'Economy',
      imageUrl: 'https://via.placeholder.com/600x300?text=RBI+Policy'
    },
    {
      id: '2',
      title: 'Startup Funding Slowdown: What Investors Are Looking For Now',
      summary: 'After a boom, Indian startups are facing a funding winter. We explore why venture capitalists are becoming more cautious and what qualities they prioritize in current market conditions.',
      body: 'The exuberance of the startup funding landscape appears to be waning, with venture capitalists (VCs) adopting a more measured approach. Gone are the days of sky-high valuations based solely on growth potential. Today, investors are rigorously scrutinizing unit economics, clear paths to profitability, and sustainable business models. Sectors like B2B SaaS, deep tech, and profitable niche consumer brands are still attracting attention, albeit with tougher terms. Founders are advised to focus on efficient capital utilization, strong corporate governance, and demonstrating a viable pathway to positive cash flows. This shift signifies a maturation of the Indian startup ecosystem, moving towards fundamentals over rapid, often unsustainable, expansion.',
      author: 'Investment Insight',
      publishedAt: '2025-06-11T14:30:00Z',
      category: 'Startups',
      imageUrl: 'https://via.placeholder.com/600x300?text=Startup+Funding'
    },
    {
      id: '3',
      title: 'The Future of Digital Payments in India: UPI\'s Next Leap',
      summary: 'UPI continues to revolutionize payments in India. We look at upcoming features and the expanding global reach of this innovative system.',
      body: 'Unified Payments Interface (UPI) has firmly established itself as the backbone of India\'s digital payment ecosystem, facilitating billions of transactions monthly. The National Payments Corporation of India (NPCI) is continuously innovating, with features like UPI Lite (for small-value offline transactions) and UPI for credit lines being rolled out. Beyond domestic dominance, UPI\'s global footprint is rapidly expanding, with partnerships in countries like France, Singapore, and Sri Lanka. This global push not only benefits Indian tourists and businesses but also positions UPI as a potential model for digital payment infrastructure worldwide. The future promises even more seamless, secure, and integrated payment experiences, further cementing India\'s position as a leader in fintech.',
      author: 'Tech Finance Desk',
      publishedAt: '2025-06-10T09:15:00Z',
      category: 'Fintech',
      imageUrl: 'https://via.placeholder.com/600x300?text=Digital+Payments'
    },
    {
      id: '4',
      title: 'Understanding Gold Bonds vs. Physical Gold: Which is Better?',
      summary: 'As gold prices fluctuate, many consider investing. Learn the pros and cons of Sovereign Gold Bonds (SGBs) compared to traditional physical gold.',
      body: 'Gold has long been a traditional hedge against inflation and market volatility. However, the methods of investing in gold have evolved. Sovereign Gold Bonds (SGBs), issued by the RBI on behalf of the government, offer an alternative to physical gold. SGBs provide interest income (currently 2.5% per annum) and are exempt from Capital Gains Tax on redemption for individuals, making them tax-efficient. They also eliminate storage concerns and purity issues associated with physical gold. Physical gold, on the other hand, offers tangible ownership and immediate liquidity. The choice between SGBs and physical gold depends on your investment horizon, risk appetite, and whether you prefer an income-generating asset without physical possession or the traditional allure of holding actual gold.',
      author: 'Wealth Insight',
      publishedAt: '2025-06-09T11:45:00Z',
      category: 'Investments',
      imageUrl: 'https://via.placeholder.com/600x300?text=Gold+Investments'
    },
    {
      id: '5',
      title: 'The Rise of Green Bonds: Investing in a Sustainable Future',
      summary: 'Discover how green bonds are empowering environmentally conscious investments and their growing role in sustainable finance.',
      body: 'Green bonds are fixed-income instruments designed to raise capital specifically for projects that have environmental benefits. These can include renewable energy, sustainable waste management, clean transportation, and environmentally friendly buildings. The global green bond market has seen exponential growth as both investors and corporations prioritize environmental, social, and governance (ESG) factors. For investors, green bonds offer a way to align their financial goals with their sustainability values, often providing competitive returns. For issuers, they represent a mechanism to finance eco-friendly initiatives and enhance their reputation as responsible corporate citizens. The emergence of robust frameworks and third-party verification ensures the credibility and impact of these bonds, making them a significant tool in the transition to a greener economy.',
      author: 'Sustainable Finance',
      publishedAt: '2025-06-08T08:00:00Z',
      category: 'ESG',
      imageUrl: 'https://via.placeholder.com/600x300?text=Green+Bonds'
    }
  ];
  
  // Export the articles array so it can be imported in other files (like index.js)
  module.exports = articles;