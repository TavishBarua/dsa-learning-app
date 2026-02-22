// PDF text extraction utility

/**
 * Extract text from PDF file using FileReader
 * Note: This is a simple text extraction that works for basic PDFs
 * For complex PDFs, users should copy-paste the text directly
 *
 * @param file - PDF file to extract text from
 * @returns Promise with extracted text
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        // Convert ArrayBuffer to string
        const uint8Array = new Uint8Array(arrayBuffer);
        const textDecoder = new TextDecoder('utf-8');
        let text = textDecoder.decode(uint8Array);

        // Clean up PDF artifacts
        // Remove PDF metadata and binary data
        text = text
          .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F]/g, '') // Remove control characters
          .replace(/<<[^>]*>>/g, '') // Remove PDF objects
          .replace(/\/[A-Za-z]+/g, '') // Remove PDF commands
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();

        // If extraction is too messy or empty, throw error
        if (!text || text.length < 50) {
          throw new Error('Unable to extract readable text from PDF');
        }

        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse PDF. Please copy-paste your resume text instead.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read PDF file. Please try again or paste text directly.'));
    };

    // Read as ArrayBuffer for better PDF handling
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Validate if file is a PDF
 * @param file - File to validate
 * @returns true if file is PDF, false otherwise
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Get file size in MB
 * @param file - File to check
 * @returns File size in megabytes
 */
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
}

/**
 * Validate PDF file before processing
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validatePDFFile(file: File): { valid: boolean; error?: string } {
  if (!isPDF(file)) {
    return { valid: false, error: 'Please upload a PDF file' };
  }

  const sizeMB = getFileSizeMB(file);
  if (sizeMB > 5) {
    return { valid: false, error: 'PDF file is too large (max 5MB)' };
  }

  return { valid: true };
}
