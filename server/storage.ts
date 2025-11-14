import type { TimelineEvent, BiographySection, Shabad, Gurdwara, Resource, RaagInfo } from "@shared/schema";

export interface IStorage {
  // Biography
  getTimeline(): Promise<TimelineEvent[]>;
  getBiographySections(): Promise<BiographySection[]>;
  
  // Shabads
  getShabads(): Promise<Shabad[]>;
  getShabadById(id: string): Promise<Shabad | null>;
  getShabadsByRaag(raagId: string): Promise<Shabad[]>;
  
  // Raags
  getRaags(): Promise<RaagInfo[]>;
  getRaagById(id: string): Promise<RaagInfo | null>;
  
  // Gurdwaras
  getGurdwaras(): Promise<Gurdwara[]>;
  getGurdwaraById(id: string): Promise<Gurdwara | null>;
  
  // Resources
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
}

// Load Gurdwara data from JSON file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { raags as raagsList } from "./raags-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chronological order mapping for Guru Tegh Bahadur Ji's journey
const gurdwaraChronology: Record<string, { visitDate: string; order: number }> = {
  "gurdwara-guru-ke-mahil-pa": { visitDate: "1621", order: 1 },
  "gurdwara-sri-manji-sahib": { visitDate: "1664", order: 2 },
  "gurdwara-kotha-sahib-pind-valla": { visitDate: "1665", order: 3 },
  "gurdwara-guru-teg-bahadur-sahib": { visitDate: "1665", order: 4 },
  "gurdwara-manji-sahib-patshahi-nauvin": { visitDate: "1665", order: 5 },
  "gurdwara-patshahi-nauvin": { visitDate: "1665-1666", order: 6 },
  "gurdwara-manji-sahib": { visitDate: "1666", order: 7 },
  "gurdwara-dhamdhan-sahib-patshahi-nauvin": { visitDate: "1665", order: 8 },
  "gurdwara-manji-sahib-patshahi-nauvin-kaithal": { visitDate: "1665", order: 9 },
  "gurdwara-manji-sahib-patshahi-nauvin-bani": { visitDate: "1665", order: 10 },
};

function loadGurdwaraData(): Gurdwara[] {
  try {
    const dataPath = path.join(__dirname, "gurdwara-data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const gurdwaras = JSON.parse(rawData) as Array<{
      id: string;
      name: string;
      content: string;
      pdfFileName: string | null;
    }>;

    // Manual PDF mapping based on file names in attached_assets
    // Mapping gurdwara IDs from JSON to available PDF files
    const pdfMap: Record<string, string[]> = {
      "gurdwara-guru-ke-mahil-pa": ["Bhagrhana_1763096532033.pdf"],
      "gurdwara-guru-teg-bahadur-sahib": ["Mirjapur_1763096532062.pdf"],
      "gurdwara-manji-sahib-patshahi-nauvin": ["Railon_1763096532037.pdf"],
      "gurdwara-sri-manji-sahib": ["Gurdwara Maithan Sahib Agra_1763096532064.pdf"],
      "gurdwara-kotha-sahib-pind-valla": ["V. Nandpur_1763096532035.pdf"],
      "gurdwara-patshahi-nauvin": ["Moti Bagh Patiala_1763096532041.pdf"],
      "gurdwara-manji-sahib": ["Gurdwara Sahib Tamsimbli_1763096532024.pdf"],
      "gurdwara-dhamdhan-sahib-patshahi-nauvin": ["Dhirba_1763096532057.pdf"],
      "gurdwara-tharrha-sahib-sahib": ["ਗੁਰਦੁਆਰਾ ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਪਾਤਸ਼ਾਹੀ ਨੌਵੀਂ ਬਹਾਦਰਗੜ੍ਹ _1763096532039.pdf", "ਕਿਲ੍ਹਾ, ਬਹਾਦਰਗੜ੍ਹ _1763096532051.pdf"],
      "gurdwara-sri-sadabarat-sahib": ["Kamalpur_1763096532029.pdf"],
      "gurdwara-sohiana-sahib": ["gharancho_1763096532053.pdf"],
      "gurdwara-sri-chacha-faggu-mall": ["Gandhua_1763096532049.pdf"],
      "gurdwara-sri-bari-sangat-sahib": ["Gurne Kalan_1763096532055.pdf"],
      "gurdwara-sri-damdama-sahib-bari": ["ਗੁਰਦੁਆਰਾ ਮੰਜੀ ਸਾਹਿਬ ਪਾਤਸ਼ਾਹੀ ਨੌਵੀਂ  Aloarkh_1763096532031.pdf"],
      "gurdwara-sri-guru-teg-bahadur-sahib": ["Gaga_1763096532047.pdf", "Gurdwara Tap Asthan Sahib ( UP)_1763096532060.pdf"],
      "gurdwara-sis-ganj-sahib": ["Ghanor Jatta_1763096532058.pdf"],
      "gurdwara-sis-ganj-sahib-patshahi-nauvin": ["ਗੁਰਦੁਆਰਾ ਅਕੋਈ ਸਾਹਿਬ_1763096532043.pdf", "ਗੁਰਦੁਆਰਾ ਦੁੱਖ ਨਿਵਾਰਨ ਸਾਹਿਬ ਪਟਿਆਲਾ_1763096532045.pdf"],
    };

    // Transform and enrich data
    return gurdwaras.map((g) => {
      // Extract brief history from content (first 150-200 characters)
      const contentLines = g.content.split("\n");
      const firstPara = contentLines[0] || g.content;
      const briefHistory = firstPara.substring(0, 200).trim() + (firstPara.length > 200 ? "..." : "");

      // Extract location from name (text in parentheses)
      const locationMatch = g.name.match(/\(([^)]+)\)/);
      const location = locationMatch ? locationMatch[1] : "";

      // Build PDF assets
      const pdfFiles = pdfMap[g.id] || [];
      const pdfAssets = pdfFiles.map((fileName) => ({
        label: "ਵਧੇਰੇ ਜਾਣਕਾਰੀ",
        fileName,
      }));

      const chronology = gurdwaraChronology[g.id];
      
      return {
        id: g.id,
        name: g.name,
        imageUrl: undefined,
        briefHistory,
        fullHistory: g.content,
        location: {
          address: location,
          mapEmbedUrl: undefined,
        },
        pdfAssets: pdfAssets.length > 0 ? pdfAssets : undefined,
        visitDate: chronology?.visitDate,
        chronologicalOrder: chronology?.order,
      };
    })
    .sort((a, b) => (a.chronologicalOrder || 999) - (b.chronologicalOrder || 999));
  } catch (error) {
    console.error("Error loading gurdwara data:", error);
    return [];
  }
}

export class MemStorage implements IStorage {
  private raags: RaagInfo[] = raagsList;
  
  private timeline: TimelineEvent[] = [
    { year: "1621", label: "ਜਨਮ", sectionId: "janm" },
    { year: "1635", label: "ਕਰਤਾਰਪੁਰ ਦੀ ਲੜਾਈ", sectionId: "kartarpur" },
    { year: "1664", label: "ਗੁਰਤਾ ਗੱਦੀ", sectionId: "gurgaddi" },
    { year: "1665-1675", label: "ਉਦੇਸੀ ਯਾਤਰਾ", sectionId: "yatra" },
    { year: "1675", label: "ਸ਼ਹੀਦੀ", sectionId: "shahidi" }
  ];

  private biographySections: BiographySection[] = [
    {
      id: "janm",
      heading: "ਜਨਮ ਅਤੇ ਮੁੱਢਲਾ ਜੀਵਨ (1621)",
      content: `ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ ਦਾ ਜਨਮ 1 ਅਪ੍ਰੈਲ 1621 ਦਿਨ ਐਤਵਾਰ ਨੂੰ ਮਾਤਾ ਨਾਨਕੀ ਜੀ ਦੀ ਕੁੱਖੋਂ ਅੰਮ੍ਰਿਤਸਰ ਵਿਖੇ ਗੁਰਦਵਾਰਾ ਗੁਰੂ ਕੇ ਮਹਿਲ ਦੇ ਸਥਾਨ ਤੇ ਹੋਇਆ। ਆਪ ਜੀ ਛੇਵੇਂ ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ ਦੇ ਪੰਜਵੇਂ ਅਤੇ ਸੱਭ ਤੋਂ ਛੋਟੇ ਪੁੱਤਰ ਸਨ। ਬਚਪਨ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਨਾਮ ਤਿਆਗ ਮੱਲ ਸੀ।

ਆਪ ਜੀ ਨੇ 9 ਸਾਲ ਦੇ ਕਰੀਬ ਸਮਾਂ ਅੰਮ੍ਰਿਤਸਰ ਵਿਖੇ ਗੁਜ਼ਾਰਿਆ ਅਤੇ ਫਿਰ ਕਰਤਾਰਪੁਰ ਜਿਲ੍ਹਾ ਜਲੰਧਰ ਵਿਖੇ ਚਲੇ ਗਏ। ਗੁਰੂ ਜੀ ਦੇ ਭੈਣ ਭਰਾਵਾਂ ਦੇ ਨਾਮ ਬਾਬਾ ਗੁਰਦਿੱਤਾ ਜੀ, ਬਾਬਾ ਸੂਰਜ ਮੱਲ, ਬਾਬਾ ਅਟੱਲ ਰਾਏ ਅਤੇ ਬੀਬੀ ਵੀਰੋ ਹਨ।

ਆਪ ਦਾ ਵਿਆਹ ਲਖਨੋਰੀ ਪਿੰਡ ਦੇ ਲਾਲਚੰਦ ਦੀ ਪੁੱਤਰੀ ਮਾਤਾ ਗੁਜਰੀ ਜੀ ਨਾਲ 1634 ਵਿੱਚ ਹੋਇਆ। ਉਨ੍ਹਾਂ ਨੂੰ ਵਿਆਹ ਤੋਂ 32 ਸਾਲ ਮਗਰੋਂ ਪੁੱਤਰ ਦੀ ਦਾਤ ਪ੍ਰਾਪਤ ਹੋਈ, ਪੁੱਤਰ ਹੋਣ ਮਗਰੋਂ ਉਹ ਆਪਣੇ ਪੁੱਤਰ ਗੋਬਿੰਦ ਰਾਏ ਨੂੰ 5 ਸਾਲ ਬਾਅਦ ਗੁਰੂ ਗੱਦੀ ਦੇ ਗਏ।`
    },
    {
      id: "kartarpur",
      heading: "ਕਰਤਾਰਪੁਰ ਦੀ ਲੜਾਈ (1635)",
      content: `ਸਿੱਖ ਵਿਦਵਾਨ ਪ੍ਰਿੰਸੀਪਲ ਸਤਬੀਰ ਸਿੰਘ ਜੀ ਅਨੁਸਾਰ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਸਾਹਿਬ ਜੀ ਨਿਮਰਤਾ ਦੇ ਪੁੰਜ ਤੇ ਮਨ ਨੀਵਾਂ ਤੇ ਮਤ ਉਚੀ ਦੇ ਧਾਰਨੀ ਸਨ। ਇਤਿਹਾਸ ਮੁਤਾਬਕ ਜਦੋਂ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਸਾਹਿਬ ਜੀ ਆਪਣੇ ਪਿਤਾ ਜੀ ਦੇ ਸਨਮੁੱਖ ਬੈਠ ਕੇ ਵੈਰਾਗ ਭਾਵ ਦੇ ਸ਼ਬਦ ਉਚਾਰਦੇ ਸਨ ਉਦੋਂ ਇਹਨਾਂ ਦਾ ਨਾਮ ਗੁਰੂ ਜੀ ਨੇ ਤਿਆਗ ਮੱਲ ਤੋਂ ਬਦਲ ਕੇ ਤੇਗ ਬਹਾਦਰ ਰੱਖਿਆ।

ਗੁਰੂ ਜੀ ਬਚਪਨ ਤੋਂ ਹੀ ਸੰਤ ਸਰੂਪ ਅਡੋਲ ਚਿੱਤ ਗੰਭੀਰ ਤੇ ਨਿਰਭੈ ਸੁਭਾਅ ਦੇ ਮਾਲਕ ਸਨ। ਗੁਰੂ ਜੀ ਕਈ ਕਈ ਘੰਟੇ ਸਮਾਧੀ ਵਿੱਚ ਲੀਨ ਹੋਏ ਬੈਠੇ ਰਹਿੰਦੇ।`
    },
    {
      id: "gurgaddi",
      heading: "ਗੁਰਗੱਦੀ ਉੱਪਰ ਬਿਰਾਜਮਾਨ ਹੋਣਾ (1664)",
      content: `ਉਨ੍ਹਾਂ ਨੂੰ 1664 ਈ. ਸਵੀਂ ਨੂੰ ਗੁਰਿਆਈ ਪ੍ਰਾਪਤ ਹੋਈ। ਆਪ ਜੀ ਸਾਹਿਬ ਸ੍ਰੀ ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ ਦੇ ਛੋਟੇ ਸਪੁੱਤਰ ਸਨ। ਆਪ ਜੀ ਬਚਪਨ ਤੋਂ ਹੀ ਵੈਰਾਗੀ ਤੇ ਉਪਰਾਮ ਤਬੀਅਤ ਦੇ ਮਾਲਕ ਸਨ।

ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ ਦੇ ਜੋਤੀ ਜੋਤ ਸਮਾਉਣ ਤੋਂ ਬਾਅਦ ਆਪ ਪਿੰਡ ਬਕਾਲਾ ਆ ਕੇ ਇਕਾਂਤ ਵਿੱਚ ਨਾਮ ਸਿਮਰਨ ਕਰਨ ਲੱਗ ਪਏ। ਇਕ ਸਾਲ ਪਿੱਛੋਂ ਭਾਈ ਮੱਖਣ ਸ਼ਾਹ ਲੁਬਾਣਾ ਜਿਸ ਦਾ ਜਹਾਜ਼ ਸਮੁੰਦਰ ਦੀ ਘੁੰਮਣ ਘੇਰੀ ਵਿੱਚ ਗੁਰੂ ਜੀ ਦੀ ਕਿਰਪਾ ਨਾਲ ਪਾਰ ਲੰਗਾ ਸੀ, ਆਪਣੀ ਸੁੱਖਣਾ ਦੀਆਂ 500 ਮੋਹਰਾਂ ਲੈ ਕੇ ਬਾਬੇ ਬਕਾਲੇ ਪੁੱਜਾ।

ਉਸ ਸਮੇਂ ਉਥੇ 22 ਗੁਰੂਆਂ ਦੀਆਂ ਮੰਜੀਆਂ ਹੋਈਆਂ ਸਨ। ਭਾਈ ਮੱਖਣ ਸ਼ਾਹ ਸੱਚੇ ਗੁਰੂ ਦੀ ਭਾਲ ਵਿੱਚ ਇਕ ਇਕ ਕਰਕੇ ਸਭਨਾਂ ਕੋਲ ਗਿਆ ਪਰ ਕਿਸੇ ਨੇ ਵੀ ਸਹੀ ਉੱਤਰ ਨਾ ਦਿੱਤਾ। ਅੰਤ ਵਿੱਚ ਜਦੋਂ ਉਹ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਕੋਲ ਗਿਆ ਤਾਂ ਗੁਰੂ ਜੀ ਨੇ ਸਹੀ ਉੱਤਰ ਦਿੱਤਾ ਅਤੇ ਇਸ ਤਰ੍ਹਾਂ ਸੱਚੇ ਗੁਰੂ ਦੀ ਪਛਾਣ ਹੋਈ।`
    },
    {
      id: "yatra",
      heading: "ਉਦੇਸੀ ਯਾਤਰਾ ਅਤੇ ਪ੍ਰਚਾਰ (1665-1675)",
      content: `ਬਾਬਾ ਬਕਾਲੇ ਤੋਂ ਬਾਅਦ ਆਪ ਕੀਰਤਪੁਰ ਪੁੱਜੇ ਤੇ ਫਿਰ ਕਹਿਲੂਰ ਦੇ ਰਾਜੇ ਤੋਂ ਜਮੀਨ ਖਰੀਦ ਕੇ ਆਨੰਦਪੁਰ ਸਾਹਿਬ ਸ਼ਹਿਰ ਵਸਾਇਆ। ਤੇ ਫਿਰ ਉਸ ਜਗਾ ਤੇ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਨੇ ਖਾਲਸਾ ਪੰਥ ਦੀ ਸਾਜਨਾ ਕੀਤੀ।

ਗੁਰੂ ਜੀ ਨੇ ਆਪਣੇ ਕਾਲ ਦੌਰਾਨ ਮਾਲਵੇ, ਅਸਾਮ, ਬੰਗਾਲ ਅਤੇ ਹੋਰ ਬਹੁਤ ਸਾਰੇ ਸਥਾਨਾਂ ਦੀ ਯਾਤਰਾ ਕੀਤੀ ਅਤੇ ਗੁਰਬਾਣੀ ਦਾ ਪ੍ਰਚਾਰ ਕੀਤਾ। ਇਨ੍ਹਾਂ ਯਾਤਰਾਵਾਂ ਦੌਰਾਨ ਆਪ ਨੇ ਕਈ ਗੁਰਦੁਆਰੇ ਸਥਾਪਿਤ ਕੀਤੇ ਜੋ ਅੱਜ ਤੱਕ ਗੁਰੂ ਜੀ ਦੀ ਯਾਦ ਦਿਵਾਉਂਦੇ ਹਨ।

ਉਨ੍ਹਾਂ ਦੀ ਬਾਣੀ 15 ਰਾਗਾਂ ਵਿੱਚ ਦਰਜ ਹੈ ਜੋ ਇਸ ਪ੍ਰਕਾਰ ਹਨ: ਬਿਹਾਗੜਾ, ਗਉੜੀ, ਆਸਾ, ਦੇਵਗੰਧਾਰ, ਸੋਰਠਿ, ਧਨਾਸਰੀ, ਟੋਡੀ, ਤਿਲੰਗ, ਬਿਲਾਵਲ, ਰਾਮਕਲੀ, ਮਾਰੂ, ਬਸੰਤ, ਬਸੰਤ ਹਿਡੋਲ, ਸਾਰੰਗ, ਅਤੇ ਜੈਜੈਵੰਤੀ।`
    },
    {
      id: "shahidi",
      heading: "ਕਸ਼ਮੀਰੀ ਪੰਡਿਤਾਂ ਦੀ ਫ਼ਰਿਆਦ ਅਤੇ ਸ਼ਹੀਦੀ (1675)",
      content: `ਉਸ ਸਮੇਂ ਮੁਗਲ ਬਾਦਸਾਹ ਔਰੰਗਜ਼ੇਬ ਦੇ ਹੁਕਮ ਅਨੁਸਾਰ ਕਸਮੀਰ ਦਾ ਸੂਬੇਦਾਰ ਸ਼ੇਰ ਅਫ਼ਗਾਨ ਤਲਵਾਰ ਦੇ ਜੋਰ ਨਾਲ ਕਸਮੀਰੀ ਹਿੰਦੂਆਂ ਨੂੰ ਮੁਸਲਮਾਨ ਬਣਾ ਰਿਹਾ ਸੀ। ਕਸਮੀਰ ਦੇ ਦੁਖੀ ਪੰਡਤ ਗੁਰੂ ਜੀ ਕੋਲ ਫਰਿਆਦ ਲੈ ਕੇ ਆਏ ਤੇ ਆਖਣ ਲੱਗੇ ਕਿ ਸਾਡੇ ਲਈ ਕੋਈ ਰਾਹ ਨਹੀਂ ਰਿਹਾ।

25 ਮਈ 1675 ਦੇ ਦਿਨ 16 ਕਸ਼ਮੀਰੀ ਬ੍ਰਾਹਮਣ ਗੁਰੂ ਜੀ ਕੋਲ ਆਨੰਦਪੁਰ ਸਾਹਿਬ ਪਹੁੰਚੇ। ਗੁਰੂ ਜੀ ਨੇ ਉਨ੍ਹਾਂ ਦੀ ਫ਼ਰਿਆਦ ਸੁਣ ਕੇ ਫੈਸਲਾ ਲਿਆ ਕਿ ਉਹ ਆਪ ਔਰੰਗਜ਼ੇਬ ਕੋਲ ਜਾਣਗੇ।

ਆਪ ਨੂੰ ਤੇ ਆਪ ਦੇ ਸਾਥੀਆਂ ਨੂੰ ਆਗਰੇ ਵਿੱਚ ਗ੍ਰਿਫਤਾਰ ਕਰ ਲਿਆ ਗਿਆ। ਆਪ ਦੁਆਰਾ ਹਕੂਮਤ ਦੀ ਨੀਤੀ ਅਨੁਸਾਰ ਇਸਲਾਮ ਧਰਮ ਕਬੂਲ ਨਾ ਕਰਨ ਕਰਕੇ ਚਾਦਨੀ ਚੌਕ ਦੀ ਕੋਤਵਾਲੀ ਵਿੱਚ ਆਪ ਨੂੰ ਅਨੇਕਾਂ ਕਸ਼ਟ ਦਿੱਤੇ ਗਏ। ਆਪ ਅਡੋਲ ਰਹੇ।

ਔਰੰਗਜ਼ੇਬ ਦੇ ਹੁਕਮ ਅਨੁਸਾਰ ਪਹਿਲਾਂ ਭਾਈ ਮਤੀ ਦਾਸ ਜੀ ਨੂੰ ਆਰੇ ਨਾਲ ਚੀਰਿਆ ਗਿਆ। ਭਾਈ ਦਿਆਲਾ ਜੀ ਨੂੰ ਉਬਲਦੀ ਦੇਗ ਵਿੱਚ ਸੁੱਟ ਦਿੱਤਾ ਗਿਆ। ਇਸ ਪ੍ਰਕਾਰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਗੁਰੂ ਜੀ ਦੇ ਮੁਰੀਦਾਂ ਨੂੰ ਅਣਮਨੁੱਖੀ ਤਸੀਹੇ ਦੇ ਕੇ ਹੋਣ ਵਾਲੀ ਸ਼ਹੀਦੀ ਦਾ ਨਮੂਨਾ ਦਿਖਾਇਆ ਗਿਆ।

ਗੁਰੂ ਜੀ ਨੂੰ ਚੜ੍ਹਦੀ ਕਲਾ ਵਿੱਚ ਅਤੇ ਉਨ੍ਹਾਂ ਦੁਆਰਾ ਇਸਲਾਮ ਨਾ ਕਬੂਲਣ ਦੇ ਅਟੱਲ ਨਿਸ਼ਚੈ ਨੂੰ ਵੇਖ ਕੇ ਔਰੰਗਜ਼ੇਬ ਗੁੱਸੇ ਵਿੱਚ ਕੰਬ ਉੱਠਿਆ। ਅੰਤ ਵਿੱਚ 24 ਨਵੰਬਰ 1675 ਨੂੰ ਚਾਦਨੀ ਚੌਕ, ਦਿੱਲੀ ਵਿੱਚ ਗੁਰੂ ਜੀ ਨੂੰ ਸ਼ਹੀਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।

ਅੰਤ ਸਾਹਿਬ ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਸਾਹਿਬ ਜੀ ਹਿੰਦ ਦੀ ਚਾਦਰ ਅਰਥਾਤ ਸਮੂਹ ਕਾਇਨਾਤ ਦੀ ਇਜੱਤ ਅਤੇ ਅਣਖ ਦੇ ਰਖਵਾਲੇ ਸਨ।`
    }
  ];

  private shabads: Shabad[] = [
    {
      id: "shabad-1",
      title: "ਸਲੋਕ ਮਹਲਾ ੯",
      gurmukhi: `ਚਿੰਤਾ ਤਾ ਕੀ ਕੀਜੀਐ ਜੋ ਅਨਹੋਨੀ ਹੋਇ।
ਇਹੁ ਮਾਰਗੁ ਸੰਸਾਰ ਕੋ ਨਾਨਕੁ ਥਿਰੁ ਨਹੀ ਕੋਇ।`,
      meaning: "Only worry about that which is unexpected. This is the way of the world, O Nanak, nothing is permanent here.",
      teeka: "ਪ੍ਰੋ. ਸਾਹਿਬ ਸਿੰਘ ਜੀ ਦੀ ਟੀਕਾ: ਇਸ ਸ਼ਬਦ ਵਿਚ ਗੁਰੂ ਜੀ ਸਮਝਾਉਂਦੇ ਹਨ ਕਿ ਜੀਵਨ ਅਸਥਾਈ ਹੈ ਅਤੇ ਸਾਨੂੰ ਉਹਨਾਂ ਗੱਲਾਂ ਦੀ ਫਿਕਰ ਨਹੀਂ ਕਰਨੀ ਚਾਹੀਦੀ ਜੋ ਸਾਡੇ ਵੱਸ ਵਿਚ ਨਹੀਂ ਹਨ। ਸੰਸਾਰ ਵਿਚ ਕੋਈ ਵੀ ਚੀਜ਼ ਸਥਾਈ ਨਹੀਂ, ਇਸ ਲਈ ਪਰਮਾਤਮਾ ਦੇ ਨਾਮ ਵਿਚ ਜੁੜਨਾ ਹੀ ਅਸਲ ਮਨੋਰਥ ਹੈ।",
      raag: {
        name: "ਸਲੋਕ ਮਹਲਾ ੯",
        time: "ਕੋਈ ਖਾਸ ਸਮਾਂ ਨਹੀਂ",
        mood: "ਸ਼ਾਂਤ ਅਤੇ ਗਿਆਨਵਾਨ",
        significance: "ਇਹ ਸਲੋਕ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਵਿੱਚ ਦਰਜ ਹੈ ਅਤੇ ਜੀਵਨ ਦੀ ਅਸਥਾਈਤਾ ਅਤੇ ਪਰਮਾਤਮਾ ਦੇ ਨਾਮ ਦੇ ਮਹੱਤਵ ਬਾਰੇ ਸਿੱਖਿਆ ਦਿੰਦਾ ਹੈ।"
      },
      raagId: "gauri",
      audioUrl: "https://www.searchgurbani.com/shabad_audio/02/5830/51890/2.mp3",
      pageNumber: 1428
    },
    {
      id: "shabad-2",
      title: "ਮਨ ਰੇ ਨਾਮੁ ਜਪਤ ਸੁਖੁ ਹੋਇ",
      gurmukhi: `ਮਨ ਰੇ ਨਾਮੁ ਜਪਤ ਸੁਖੁ ਹੋਇ।
ਬਿਨੁ ਹਰਿ ਭਜਨ ਜੀਵਨੁ ਸਭੁ ਸੋਇ।`,
      meaning: "O mind, by chanting the Name, peace is obtained. Without meditating on the Lord, the whole life is wasted.",
      teeka: "ਪ੍ਰੋ. ਸਾਹਿਬ ਸਿੰਘ ਜੀ ਦੀ ਟੀਕਾ: ਗੁਰੂ ਜੀ ਮਨ ਨੂੰ ਸੰਬੋਧਨ ਕਰ ਕੇ ਕਹਿੰਦੇ ਹਨ ਕਿ ਪਰਮਾਤਮਾ ਦਾ ਨਾਮ ਸਿਮਰਨ ਹੀ ਅਸਲ ਸੁਖ ਹੈ। ਬਿਨਾਂ ਭਜਨ ਦੇ ਜੀਵਨ ਵਿਅਰਥ ਹੈ, ਜਿਵੇਂ ਨੀਂਦ ਵਿੱਚ ਕੋਈ ਨਾ ਜਾਣੇ ਕਿ ਕੀ ਹੋ ਰਿਹਾ ਹੈ।",
      raag: {
        name: "ਗਉੜੀ",
        time: "ਸ਼ਾਮ ਦਾ ਪਹਿਲਾ ਪਹਿਰ",
        mood: "ਗੰਭੀਰ ਅਤੇ ਸ਼ਾਂਤ",
        significance: "ਰਾਗ ਗਉੜੀ ਇੱਕ ਗੰਭੀਰ ਰਾਗ ਹੈ ਜੋ ਸ਼ਾਮ ਦੇ ਸਮੇਂ ਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਇਹ ਮਨ ਨੂੰ ਸ਼ਾਂਤ ਅਤੇ ਇਕਾਗਰ ਕਰਦਾ ਹੈ।"
      },
      raagId: "gauri",
      audioUrl: "https://www.searchgurbani.com/shabad_audio/01/3711/35710/1.mp3",
      pageNumber: 219
    },
    {
      id: "shabad-3",
      title: "ਜੋ ਨਰੁ ਦੁਖ ਵਿਚਿ ਦੁਖੁ ਨਹੀ ਮਾਨੈ",
      gurmukhi: `ਜੋ ਨਰੁ ਦੁਖ ਵਿਚਿ ਦੁਖੁ ਨਹੀ ਮਾਨੈ।
ਸੁਖ ਸਨੇਹੁ ਅਰੁ ਭੈ ਨਹੀ ਜਾ ਕੈ।
ਕੰਚਨ ਮਾਟੀ ਮਾਨੈ।`,
      meaning: "One who does not feel pain in suffering, who is not attached to pleasure, who has no fear, and who sees gold and dust as the same.",
      teeka: "ਪ੍ਰੋ. ਸਾਹਿਬ ਸਿੰਘ ਜੀ ਦੀ ਟੀਕਾ: ਇਸ ਸ਼ਬਦ ਵਿੱਚ ਗੁਰੂ ਜੀ ਸਮਝਾਉਂਦੇ ਹਨ ਕਿ ਜਿਹੜਾ ਮਨੁੱਖ ਦੁੱਖਾਂ-ਸੁੱਖਾਂ ਵਿੱਚ ਇਕੋ ਜਿਹਾ ਰਹਿੰਦਾ ਹੈ, ਜਿਸਨੂੰ ਮਾਇਆ ਦਾ ਮੋਹ ਨਹੀਂ, ਜੋ ਧਨ-ਦੌਲਤ ਅਤੇ ਮਿੱਟੀ ਵਿੱਚ ਕੋਈ ਫਰਕ ਨਹੀਂ ਸਮਝਦਾ - ਉਹ ਅਸਲ ਵਿੱਚ ਗਿਆਨਵਾਨ ਹੈ।",
      raag: {
        name: "ਸੋਰਠਿ",
        time: "ਰਾਤ ਦਾ ਦੂਜਾ ਪਹਿਰ",
        mood: "ਗੰਭੀਰ ਅਤੇ ਵੈਰਾਗੀ",
        significance: "ਰਾਗ ਸੋਰਠਿ ਵੈਰਾਗ ਅਤੇ ਨਿਰਲਿਪਤਤਾ ਦਾ ਭਾਵ ਜਗਾਉਂਦਾ ਹੈ। ਇਹ ਰਾਗ ਮਨ ਨੂੰ ਮਾਇਆ ਤੋਂ ਉਪਰਾਮ ਕਰਨ ਵਿੱਚ ਸਹਾਈ ਹੈ।"
      },
      raagId: "sorath",
      audioUrl: "https://www.searchgurbani.com/shabad_audio/01/4160/40100/1.mp3",
      pageNumber: 633
    },
    {
      id: "shabad-4",
      title: "ਕਬੀਰ ਮਨੁ ਨਿਰਮਲੁ ਭਇਆ",
      gurmukhi: `ਕਬੀਰ ਮਨੁ ਨਿਰਮਲੁ ਭਇਆ ਜੈਸਾ ਗੰਗਾ ਨੀਰੁ।
ਪਾਛੈ ਲਾਗੋ ਹਰਿ ਫਿਰੈ ਕਹਤ ਕਬੀਰ ਕਬੀਰ।`,
      meaning: "Kabir, my mind has become pure, like the water of the Ganges. The Lord follows after me, calling 'Kabir! Kabir!'",
      teeka: "ਜਦੋਂ ਮਨੁੱਖ ਦਾ ਮਨ ਪਵਿੱਤਰ ਹੋ ਜਾਂਦਾ ਹੈ, ਤਾਂ ਪਰਮਾਤਮਾ ਆਪ ਉਸ ਦੇ ਪਿੱਛੇ ਆਉਂਦਾ ਹੈ। ਗੁਰੂ ਜੀ ਦੱਸਦੇ ਹਨ ਕਿ ਸੁੱਚੇ ਮਨ ਨਾਲ ਪਰਮਾਤਮਾ ਦੀ ਪ੍ਰਾਪਤੀ ਹੁੰਦੀ ਹੈ।",
      raag: {
        name: "ਆਸਾ",
        time: "ਰਾਤ ਦਾ ਚੌਥਾ ਪਹਿਰ",
        mood: "ਆਸ, ਆਸ਼ਾਵਾਦੀ",
        significance: "ਰਾਗ ਆਸਾ ਆਸ਼ਾ ਅਤੇ ਉਮੀਦ ਦਾ ਰਾਗ ਹੈ।"
      },
      raagId: "asa",
      audioUrl: "https://www.searchgurbani.com/shabad_audio/01/3841/36990/1.mp3",
      pageNumber: 331
    },
    {
      id: "shabad-5",
      title: "ਮਿਤ੍ਰ ਪਿਆਰੇ ਨੂੰ",
      gurmukhi: `ਮਿਤ੍ਰ ਪਿਆਰੇ ਨੂੰ ਹਾਲ ਮੁਰੀਦਾਂ ਦਾ ਕਹਿਣਾ।
ਤੁਧੁ ਬਿਨੁ ਰੋਗੁ ਰਜਾਈਆਂ ਦਾ ਓਢਣ ਨਾਗ ਨਿਵਾਸਾਂ ਦੇ ਰਹਿਣਾ।`,
      meaning: "Tell my Beloved Friend, the condition of His humble disciples. Without You, the comfort of the bed is a disease, and the blankets are like snakes.",
      teeka: "ਗੁਰੂ ਜੀ ਪਰਮਾਤਮਾ ਨੂੰ ਮਿੱਤਰ ਕਹਿ ਕੇ ਸੰਬੋਧਨ ਕਰਦੇ ਹਨ ਅਤੇ ਦੱਸਦੇ ਹਨ ਕਿ ਉਸ ਤੋਂ ਬਿਨਾਂ ਸਾਰੇ ਸੁੱਖ ਦੁੱਖ ਬਣ ਜਾਂਦੇ ਹਨ। ਇਹ ਪਰਮਾਤਮਾ ਨਾਲ ਪ੍ਰੇਮ ਅਤੇ ਵਿਛੋੜੇ ਦਾ ਵਰਣਨ ਹੈ।",
      raag: {
        name: "ਬਿਲਾਵਲ",
        time: "ਦਿਨ ਦਾ ਪਹਿਲਾ ਪਹਿਰ",
        mood: "ਖੁਸ਼ੀਭਰਾ, ਸਵੇਰ ਦਾ ਰਾਗ",
        significance: "ਰਾਗ ਬਿਲਾਵਲ ਸਵੇਰੇ ਦਾ ਰਾਗ ਹੈ ਜੋ ਨਵੀਂ ਸ਼ੁਰੂਆਤ ਦਾ ਭਾਵ ਦਿੰਦਾ ਹੈ।"
      },
      raagId: "bilawal",
      audioUrl: "https://www.searchgurbani.com/shabad_audio/01/4658/45370/1.mp3",
      pageNumber: 819
    },
    {
      id: "shabad-6",
      title: "ਰਾਮ ਨਾਮੁ ਜਪਿ ਜੀਵਣੁ ਮਰਣੁ",
      gurmukhi: `ਰਾਮ ਨਾਮੁ ਜਪਿ ਜੀਵਣੁ ਮਰਣੁ।
ਰਾਮ ਨਾਮੁ ਜਪਿ ਸਰਬ ਸੁਖ ਪੂਰਣ।`,
      meaning: "Chant the Lord's Name in life and death. Chanting the Lord's Name, all peace is found complete.",
      teeka: "ਗੁਰੂ ਜੀ ਦੱਸਦੇ ਹਨ ਕਿ ਪਰਮਾਤਮਾ ਦਾ ਨਾਮ ਜੀਵਨ ਅਤੇ ਮੌਤ ਦੋਵਾਂ ਵਿੱਚ ਸਹਾਰਾ ਹੈ। ਨਾਮ ਸਿਮਰਨ ਨਾਲ ਹੀ ਸੰਪੂਰਨ ਸੁਖ ਪ੍ਰਾਪਤ ਹੁੰਦਾ ਹੈ।",
      raag: {
        name: "ਧਨਾਸਰੀ",
        time: "ਦਿਨ ਦਾ ਤੀਜਾ ਪਹਿਰ",
        mood: "ਮਧੁਰ, ਪੁਰਾਣਾ",
        significance: "ਰਾਗ ਧਨਾਸਰੀ ਪਰਮਾਤਮਾ ਦੀ ਸਿਫਤਿ ਸਾਲਾਹ ਲਈ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।"
      },
      raagId: "dhanasri",
      audioUrl: "https://www.searchgurbani.com/shabad_audio/01/3354/32360/1.mp3",
      pageNumber: 685
    }
  ];

  private gurdwaras: Gurdwara[] = loadGurdwaraData(); 

  private resources: Resource[] = [
    {
      id: "resource-biography",
      title: "ਸੰਪੂਰਨ ਜੀਵਨੀ",
      description: "ਸ਼੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ ਦੀ ਵਿਸਥਾਰ ਜੀਵਨੀ, ਜਨਮ ਤੋਂ ਸ਼ਹੀਦੀ ਤੱਕ",
      pdfUrl: "/resources/biography.pdf",
      category: "ਜੀਵਨੀ"
    },
    {
      id: "resource-timeline",
      title: "ਇਤਿਹਾਸਕ ਸਮਾਂਰੇਖਾ",
      description: "1621 ਤੋਂ 1675 ਤੱਕ ਦੀਆਂ ਮਹੱਤਵਪੂਰਨ ਘਟਨਾਵਾਂ ਅਤੇ ਤਰੀਖਾਂ",
      pdfUrl: "/resources/timeline.pdf",
      category: "ਜੀਵਨੀ"
    },
    {
      id: "resource-teachings",
      title: "ਸਿੱਖਿਆਵਾਂ ਅਤੇ ਸੰਦੇਸ਼",
      description: "ਗੁਰੂ ਜੀ ਦੀਆਂ ਸਿੱਖਿਆਵਾਂ ਅਤੇ ਜੀਵਨ ਦਰਸ਼ਨ",
      pdfUrl: "/resources/teachings.pdf",
      category: "ਸਿੱਖਿਆਵਾਂ"
    },
    {
      id: "resource-shabads",
      title: "ਬਾਣੀ ਅਰਥ",
      description: "ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ ਦੀਆਂ ਬਾਣੀਆਂ ਦੇ ਅਰਥ ਅਤੇ ਟੀਕਾ",
      pdfUrl: "/resources/shabads.pdf",
      category: "ਬਾਣੀ"
    },
    {
      id: "resource-gurdwaras",
      title: "ਗੁਰਦੁਆਰਿਆਂ ਦਾ ਇਤਿਹਾਸ",
      description: "ਗੁਰੂ ਜੀ ਨਾਲ ਜੁੜੇ ਸਾਰੇ ਇਤਿਹਾਸਕ ਗੁਰਧਾਮਾਂ ਦੀ ਜਾਣਕਾਰੀ",
      pdfUrl: "/resources/gurdwaras.pdf",
      category: "ਗੁਰਦੁਆਰੇ ਸਾਹਿਬ"
    }
  ];

  async getTimeline(): Promise<TimelineEvent[]> {
    return this.timeline;
  }

  async getBiographySections(): Promise<BiographySection[]> {
    return this.biographySections;
  }

  async getShabads(): Promise<Shabad[]> {
    return this.shabads;
  }

  async getShabadById(id: string): Promise<Shabad | null> {
    return this.shabads.find(s => s.id === id) || null;
  }

  async getGurdwaras(): Promise<Gurdwara[]> {
    return this.gurdwaras;
  }

  async getGurdwaraById(id: string): Promise<Gurdwara | null> {
    return this.gurdwaras.find(g => g.id === id) || null;
  }

  async getResources(): Promise<Resource[]> {
    return this.resources;
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return this.resources.filter(r => r.category === category);
  }

  async getRaags(): Promise<RaagInfo[]> {
    return this.raags;
  }

  async getRaagById(id: string): Promise<RaagInfo | null> {
    return this.raags.find(r => r.id === id) || null;
  }

  async getShabadsByRaag(raagId: string): Promise<Shabad[]> {
    return this.shabads.filter(s => s.raagId === raagId);
  }
}

export const storage = new MemStorage();
