import { describe, expect, test } from "@jest/globals";
import { SensOcr } from "../src/index";

describe("SensOcr Tests", () => {
  test("should detect sensitive keyword in image", async () => {
    const scanner = new SensOcr(['quick']);
    await scanner.initialize();
    
    const result = await scanner.checkSensitiveInfo("sample.png");
    expect(result).toBe(true);
  });
  test("should blur image if sensitive info is found", async () => {
    const scanner = new SensOcr(['fox']);
    await scanner.initialize();
    const result = await scanner.blurSensitiveInfo("sample2.png");
    expect(result).toBe(0);
  });
});
