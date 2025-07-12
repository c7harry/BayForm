# BayForm - Resume Builder

Resume builder built with Next.js, TypeScript, and Tailwind CSS.

Hosted at: https://bayclock.netlify.app/

## Features

✨ **Core Features**
- 🎨 Multiple professional resume templates (Modern, Creative, Elegant, Executive, Tech)
- 📝 Form-based resume builder
- 👁️ Real-time preview with template switching
- 📄 LaTeX and PDF export functionality (professional, print-optimized)
- 💾 Local storage for resume management
- 📱 Mobile-first responsive design
- 📦 QR code generation for LinkedIn and Portfolio
- ⏳ Vertical progress bar for resume completion
- 📝 Job description parser for tailored content
- 📋 Copy LaTeX code to clipboard functionality

✨ **Templates**
- **Modern**: Clean, colorful design with blue accents
- **Creative**: Bold, visually engaging layout
- **Elegant**: Minimal, sophisticated style
- **Executive**: Professional, business-focused design
- **Tech**: Sleek, tech-oriented layout

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **LaTeX Generation**: Custom LaTeX generator utility
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

### LaTeX and PDF Export
- Professional LaTeX code generation
- Download `.tex` files for use with LaTeX compilers
- Copy LaTeX code directly to clipboard
- Compatible with online editors like Overleaf
- Perfect formatting for academic and professional resumes

### Responsive Design
- Mobile-first approach
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface

## How to Use LaTeX Export

1. **Create your resume** using the form builder
2. **Switch to LaTeX Export view** using the toggle button
3. **Download the .tex file** or copy the LaTeX code
4. **Use with LaTeX editor**:
   - Upload to [Overleaf](https://overleaf.com) (recommended)
   - Use local LaTeX installation (TeX Live, MiKTeX)
   - Compile to generate professional PDF

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
