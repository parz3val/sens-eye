import sharp from 'sharp';
import { promises as fs } from 'fs';

export async function blurImage(imagePath: string, blurAmount: number): Promise<void> {
  try {
    await sharp(imagePath)
      .blur(blurAmount)
      .toFile(`${imagePath}.temp`);
    
    // Replace the original file with the blurred version
    await fs.unlink(imagePath);
    await fs.rename(`${imagePath}.temp`, imagePath);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to blur image: ${error.message}`);
    }
    // If error is not an Error object, convert to string
    throw new Error(`Failed to blur image: ${String(error)}`);
  }
}