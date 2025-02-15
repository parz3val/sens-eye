# Sens-Eye

Sens-Eye is a TypeScript library for detecting and blurring sensitive information in images. It uses OCR (Optical Character Recognition) to detect specified keywords in images and can automatically blur images containing sensitive information.

## Features
- Detect sensitive information in images using OCR
- Automatically blur images containing sensitive information
- Customizable blur intensity
- Support for multiple keywords detection
- Promise-based API

## Installation

```bash
npm install sens-eye

```
## Basic Usage

```typescript
import { SensOcr, BlurOp } from 'sens-eye';

async function example() {
  // Initialize with keywords to detect
  const scanner = new SensOcr(['confidential', 'private']);
  
  // Initialize the OCR worker
  await scanner.initialize();

  try {
    // Check if image contains sensitive information
    const hasSensitiveInfo = await scanner.checkSensitiveInfo('path/to/image.png');
    
    if (hasSensitiveInfo) {
      console.log('Sensitive information detected!');
      
      // Blur the image
      const result = await scanner.blurSensitiveInfo('path/to/image.png');
      
      if (result === BlurOp.Success) {
        console.log('Image successfully blurred');
      }
    }
  } finally {
    // Clean up resources
    await scanner.cleanup();
  }
}

```
