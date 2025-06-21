# ResumeForge - Resume Builder

A modern, responsive resume builder. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

✨ **Core Features**
- 🎨 Multiple professional resume templates (Modern, Classic, Minimal)
- 📝 Intuitive form-based resume builder
- 👁️ Real-time preview with template switching
- 📄 PDF export functionality
- 💾 Local storage for resume management
- 🤖 AI-powered resume tailoring (simulated)

✨ **Templates**
- **Modern**: Clean, colorful design with blue accents
- **Classic**: Traditional, professional layout
- **Minimal**: Clean, typography-focused design

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF, html2canvas
- **Storage**: Browser localStorage (no database required)
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Resume-Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Creating a Resume

1. Click "Create New Resume" from the dashboard
2. Fill in your personal information
3. Add your work experience, education, and skills
4. Choose from available templates
5. Save your resume

### Exporting to PDF

1. Open a resume in preview mode
2. Click "Download PDF"
3. The system will generate a high-quality PDF of your resume

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── ResumeForm.tsx     # Resume editing form
│   ├── ResumeTemplates.tsx # Resume template components
│   └── JobDescriptionForm.tsx
├── types/                 # TypeScript type definitions
│   └── resume.ts          # Resume-related types
└── utils/                 # Utility functions
    ├── storage.ts         # Local storage management
    └── pdfGenerator.ts    # PDF generation utilities
```

## Customization

### Adding New Templates

1. Create a new template component in `src/components/ResumeTemplates.tsx`
2. Add the template type to `src/types/resume.ts`
3. Update the template selector in `src/app/page.tsx`

### Styling Customization

- Edit `tailwind.config.js` for theme customization
- Modify `src/app/globals.css` for custom styles
- Update template components for design changes

## Features in Detail

### Local Storage
- Resumes are stored in browser localStorage
- No server or database required
- Data persists across browser sessions

### PDF Generation
- High-quality PDF export using html2canvas and jsPDF
- Fallback to simple text-based PDF generation
- Print-optimized styling

### Responsive Design
- Mobile-first approach
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface

## Browser Support

- Chrome 80+
- Firefox 80+
- Safari 14+
- Edge 80+

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Roadmap

🚀 **Future Enhancements**
- [ ] Database integration (Supabase/Firebase)
- [ ] User authentication
- [ ] AI integration (OpenAI GPT-4)
- [ ] More resume templates
- [ ] Cover letter generation
- [ ] Resume analytics
- [ ] Export to other formats (Word, etc.)
- [ ] Resume scoring and suggestions
- [ ] Job board integration
