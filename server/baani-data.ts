import type { BaaniRaag } from "@shared/schema";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let baaniText: string = '';

function loadBaaniText(): string {
  try {
    const textPath = join(__dirname, 'data', 'baani.txt');
    const text = readFileSync(textPath, 'utf-8');
    console.log(`Loaded Baani text (${text.length} characters)`);
    return text;
  } catch (error) {
    console.error('Error loading Baani text:', error);
    return 'ਬਾਣੀ ਲੋਡ ਕਰਨ ਵਿੱਚ ਤਰੁੱਟੀ';
  }
}

baaniText = loadBaaniText();

export function getBaaniText(): string {
  return baaniText;
}

// Keep empty raags array for compatibility
export const baaniRaags: BaaniRaag[] = [];
