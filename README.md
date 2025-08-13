# Engineering Leader Website

A modern, professional website showcasing the portfolio and expertise of an Engineering Leader with 28 years of experience in building scalable SaaS products, leading high-performing teams, and driving innovation across technology stacks.

## Features

- **Modern Design**: Clean, professional design with gradient backgrounds and smooth animations
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Components**: Hover effects, smooth scrolling navigation, and engaging UI elements
- **Portfolio Showcase**: Detailed case studies of major products (Decode & Qatalyst)
- **Professional Sections**: About, Experience, Portfolio, Expertise, and Contact sections
- **AI-Powered Chatbot**: Intelligent chatbot with Lunr.js search functionality
- **Smart Search**: Searches in ContentData first, then falls back to ChatbotData
- **Performance Optimized**: Built with Next.js 14 and optimized for speed

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: shadcn/ui components with Radix UI primitives
- **Icons**: Lucide React icons
- **TypeScript**: Full TypeScript support
- **Animations**: Tailwind CSS animations and transitions
- **Search**: Lunr.js for intelligent content search

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd engineering-leader-website
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── chatbot/         # Chatbot API with search functionality
│   │   │   └── content/         # Content API
│   │   ├── ask-me/              # Chatbot interface
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main homepage component
│   ├── components/
│   │   └── ui/                  # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       └── separator.tsx
│   └── lib/
│       ├── search.ts            # Lunr.js search functionality
│       ├── chatbot.ts           # Chatbot data types and utilities
│       ├── content.ts           # Content data types and utilities
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Customization

### Colors and Branding

The website uses a professional color scheme with emerald green as the primary accent color. You can customize the colors by modifying:

- `tailwind.config.js` - Update the color palette
- `src/app/globals.css` - Modify CSS custom properties
- Component-specific styling in individual files

### Content Updates

To update the content:

1. **Personal Information**: Edit the content in `src/app/page.tsx`
2. **Portfolio Projects**: Update the case studies in the Portfolio section
3. **Experience**: Modify the experience cards and company information
4. **Contact Information**: Update email and LinkedIn links

### Adding New Sections

To add new sections:

1. Create the section component in `src/app/page.tsx`
2. Add navigation link in the nav component
3. Style with Tailwind CSS classes
4. Ensure responsive design

### Chatbot Functionality

The website includes an intelligent chatbot powered by client-side Lunr.js search:

1. **Client-Side Search**: All search functionality runs in the browser using Lunr.js
2. **Search Priority**: The chatbot searches in ContentData first (experience, portfolio, expertise, etc.)
3. **Fallback**: If no relevant content is found, it falls back to predefined ChatbotData responses
4. **Smart Responses**: Uses semantic search to provide contextual answers based on your actual experience
5. **Static Export Compatible**: Works with static site generation and can be deployed to any static hosting

To customize the chatbot:
- Update `data/chatbot.json` for predefined responses
- Modify `data/content.json` to add searchable content
- The search functionality automatically indexes all content sections
- Test the search functionality at `/test-search` during development

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

The website can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## Performance

The website is optimized for performance with:

- Next.js 14 App Router for optimal loading
- Tailwind CSS for minimal CSS bundle size
- Optimized images and assets
- Efficient component structure
- Lazy loading where appropriate

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or support, please reach out through the contact information provided on the website. 