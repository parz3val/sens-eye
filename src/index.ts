import { createWorker } from "tesseract.js";
import { blurImage } from "./image";

/**
 * BlurOp : An enum for the result of the blur operation.
 * @enum BlurOp
 * @property {number} Success - The blur operation was successful.
 * @property {number} Failure - The blur operation failed.
 * @property {number} NoSensitiveInfo - The image did not contain any sensitive information.
 */
const enum BlurOp {
  Success,
  Failure,
  NoSensitiveInfo,
}

/**
 * SensOcr : A class for detecting and blurring sensitive information in images.
 * @constructor SensOcr
 * @param {string[]} keywords - An array of keywords to search for in the image.
 * @param {number} blurAmount - The amount of blur to apply to the image.
 * @returns {SensOcr} - A new SensOcr instance.
 *
 * @example
 * const scanner = new SensOcr(['krispcall']);
 * await scanner.initialize();
 * const result = await scanner.checkSensitiveInfo("sample.png");
 * console.log(result);
 *
 *
 *
 */
class SensOcr {
  private worker!: Tesseract.Worker;
  private keywords: string[];
  private blurAmount: number;
  private initialized: boolean = false;

  constructor(keywords: string[], blurAmount: number = 50) {
    this.blurAmount = blurAmount;
    this.keywords = keywords;
  }

  ready(): boolean {
    return this.initialized;
  }

  async initialize(): Promise<void> {
    this.worker = await createWorker("eng");
    this.initialized = true;
  }

  async reinitialize(lang: string | string[]): Promise<void> {
    await this.worker.terminate();
    this.worker = await createWorker(lang);
    this.initialized = true;
  }

  setBlurAmount(blurAmount: number): void {
    this.blurAmount = blurAmount;
  }

  async checkSensitiveInfo(imagePath: string): Promise<boolean> {
    if (!this.worker) {
      throw new Error("Worker not initialized. Call initialize() first.");
    }

    const result = await this.worker.recognize(imagePath);
    const text = result.data.text.toLowerCase();

    return this.keywords.some((keyword) =>
      text.includes(keyword.toLowerCase()),
    );
  }

  async blurSensitiveInfo(imagePath: string): Promise<BlurOp> {
    if (!this.worker) {
      throw new Error("Worker not initialized. Call initialize() first.");
    }

    const detected = await this.checkSensitiveInfo(imagePath);

    if (!detected) {
      return BlurOp.NoSensitiveInfo;
    }
    await blurImage(imagePath, this.blurAmount);

    return BlurOp.Success;
  }

  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
    }
  }
}

export { SensOcr, BlurOp };
