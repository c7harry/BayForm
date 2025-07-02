# BayForm - Resume Builder

A modern, responsive resume builder. Built with Next.js, TypeScript, and Tailwind CSS.

Hosted at: https://bayclock.netlify.app/

## Features

✨ **Core Features**
- 🎨 Multiple professional resume templates (Modern, Creative, Elegant, Executive, Tech)
- 📝 Form-based resume builder
- 👁️ Real-time preview with template switching
- 📄 PDF export functionality (high-quality, print-optimized)
- 💾 Local storage for resume management
- 📱 Mobile-first responsive design
- 📦 QR code generation for LinkedIn and Portfolio
- ⏳ Vertical progress bar for resume completion
- 📝 Job description parser for tailored content

✨ **Templates**
- **Modern**: Clean, colorful design with blue accents
- **Creative**: Bold, visually engaging layout
- **Elegant**: Minimal, sophisticated style
- **Executive**: Professional, business-focused design
- **Tech**: Sleek, tech-oriented layout

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **PDF Generation**: jsPDF, React-PDF
- **QR Code**: qrcode.react
- **Icons**: React Icons
- **State Management**: React Context API
- **Storage**: Browser localStorage (no database required)
- **Utilities**: Custom hooks, utility functions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd BayForm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

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

1. View a resume
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
│   ├── JobDescriptionForm.tsx # Job description parser
│   ├── QRCodeComponent.tsx # QR code generator
│   └── VerticalProgressBar.tsx # Progress bar UI
├── templates/             # PDF template components
│   ├── ModernResumePDF.tsx
│   ├── CreativeResumePDF.tsx
│   ├── ElegantResumePDF.tsx
│   ├── ExecutiveResumePDF.tsx
│   └── TechResumePDF.tsx
├── types/                 # TypeScript type definitions
│   └── resume.ts          # Resume-related types
└── utils/                 # Utility functions
    ├── storage.ts         # Local storage management
    └── pdfGenerator.ts    # PDF generation utilities
```

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

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
