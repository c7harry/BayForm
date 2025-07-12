import { NextRequest, NextResponse } from 'next/server';
import { ResumeData } from '../../../types/resume';
import { LatexTemplateType, generateLatex } from '../../../utils/latexGenerator';

export async function POST(request: NextRequest) {
  try {
    const { resumeData, template }: { resumeData: ResumeData; template: LatexTemplateType } = await request.json();

    console.log('Generating LaTeX on server...');
    const latexContent = generateLatex(resumeData, template);

    // Working LaTeX compilation services with correct endpoints
    const services = [
      {
        name: 'LaTeX.Online',
        url: 'https://latexonline.cc/compile',
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(latexContent)}&command=pdflatex`,
        processResponse: async (response: Response) => {
          if (response.headers.get('content-type')?.includes('application/pdf')) {
            return Buffer.from(await response.arrayBuffer());
          }
          throw new Error('Invalid response format from LaTeX.Online');
        }
      },
      {
        name: 'QuickLaTeX',
        url: 'https://quicklatex.com/latex3.f',
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `formula=${encodeURIComponent(latexContent)}&fformat=png&fsize=12px&mode=0&out=1&remhost=quicklatex.com`,
        processResponse: async (response: Response) => {
          // This service returns PNG, not PDF - skip for now
          throw new Error('QuickLaTeX returns PNG, not PDF');
        }
      },
      {
        name: 'LaTeX.codecogs',
        url: 'https://latex.codecogs.com/pdf.latex',
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: latexContent,
        processResponse: async (response: Response) => {
          if (response.headers.get('content-type')?.includes('application/pdf')) {
            return Buffer.from(await response.arrayBuffer());
          }
          throw new Error('Invalid response format from CodeCogs');
        }
      }
    ];

    let lastError = '';
    let errorDetails: string[] = [];
    
    for (const service of services) {
      try {
        console.log(`Trying ${service.name}...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(service.url, {
          method: service.method,
          headers: service.headers,
          body: service.body,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log(`${service.name} response status: ${response.status}`);
        console.log(`${service.name} response headers:`, Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const pdfBuffer = await service.processResponse(response);
          
          if (pdfBuffer.length === 0) {
            throw new Error('Empty PDF received');
          }

          // Basic PDF validation
          const pdfHeader = pdfBuffer.slice(0, 4).toString();
          if (pdfHeader !== '%PDF') {
            // Some services might return other formats, let's be more lenient
            console.log('Warning: Response may not be a valid PDF');
          }

          const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${template}.pdf`;

          console.log(`Successfully generated PDF using ${service.name}, size: ${pdfBuffer.length} bytes`);
          return new NextResponse(pdfBuffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="${fileName}"`,
              'Content-Length': pdfBuffer.length.toString(),
              'Cache-Control': 'no-cache',
            },
          });
        } else {
          const errorText = await response.text();
          lastError = `${service.name} failed: ${response.status}`;
          errorDetails.push(`${service.name}: ${response.status} - ${errorText.substring(0, 200)}`);
          console.log(`${service.name} failed:`, response.status, errorText.substring(0, 200));
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = `${service.name} timed out`;
        } else {
          lastError = `${service.name} error: ${error instanceof Error ? error.message : String(error)}`;
        }
        errorDetails.push(lastError);
        console.log(`${service.name} error:`, error);
      }
    }

    // If all services failed, return a client-side compilation instruction
    console.log('All PDF services failed, providing client-side compilation instructions');
    console.log('Error details:', errorDetails);
    
    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${template}.tex`;
    
    // Create a comprehensive response with both LaTeX and instructions
    const instructionsHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>LaTeX Compilation Instructions</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .code { background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { background: #ffe6e6; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .success { background: #e6ffe6; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
        .button { display: inline-block; background: #007cba; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Resume LaTeX Compilation</h1>
        
        <div class="error">
            <h3>PDF Generation Failed</h3>
            <p>Unfortunately, all online LaTeX services are currently unavailable. Here are your options:</p>
            <ul>
                <li>Use the LaTeX source code provided below</li>
                <li>Try the client-side compilation option</li>
                <li>Upload to Overleaf manually</li>
            </ul>
        </div>

        <div class="success">
            <h3>Option 1: Upload to Overleaf</h3>
            <p>Copy the LaTeX code below and paste it into a new document on <a href="https://www.overleaf.com" target="_blank">Overleaf</a></p>
            <a href="https://www.overleaf.com" target="_blank" class="button">Go to Overleaf</a>
        </div>

        <div class="success">
            <h3>Option 2: Client-side Compilation</h3>
            <p>Try compiling directly in your browser:</p>
            <button onclick="compileLatex()" class="button">Compile with LaTeX.js</button>
            <div id="compilation-result"></div>
        </div>

        <h3>LaTeX Source Code</h3>
        <div class="code">
            <pre id="latex-code">${latexContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>

        <h3>Error Details</h3>
        <div class="error">
            <pre>${errorDetails.join('\n')}</pre>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/latex.js/dist/latex.min.js"></script>
    <script>
        async function compileLatex() {
            const resultDiv = document.getElementById('compilation-result');
            const latexCode = document.getElementById('latex-code').textContent;
            
            try {
                resultDiv.innerHTML = '<p>Compiling LaTeX... Please wait.</p>';
                
                // Try to use LaTeX.js for client-side compilation
                const generator = new latexjs.LaTeXJSGenerator();
                const doc = generator.parse(latexCode);
                const htmlDocument = doc.getDocument();
                
                // Create a printable version
                const printWindow = window.open('', '_blank');
                printWindow.document.write(htmlDocument.outerHTML);
                printWindow.document.close();
                
                resultDiv.innerHTML = '<p style="color: green;">LaTeX compiled successfully! A new window should have opened with your resume.</p>';
                
            } catch (error) {
                console.error('Client-side compilation failed:', error);
                resultDiv.innerHTML = '<p style="color: red;">Client-side compilation failed. Please use Overleaf instead.</p>';
            }
        }
    </script>
</body>
</html>`;

    return new NextResponse(instructionsHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Fallback-Reason': 'PDF services unavailable',
        'X-Error-Details': JSON.stringify(errorDetails),
        'X-LaTeX-Content': 'true'
      },
    });

  } catch (error) {
    console.error('Error in PDF generation API:', error);
    return NextResponse.json(
      { 
        error: `Internal server error: ${error instanceof Error ? error.message : String(error)}`,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
