import type { TimelineEvent, BiographySection, BaaniPage, Gurdwara, Resource, AudioTrack } from "@shared/schema";

export interface IStorage {
  // Biography
  getTimeline(): Promise<TimelineEvent[]>;
  getBiographySections(): Promise<BiographySection[]>;
  
  // Baani Pages
  getBaaniPages(): Promise<BaaniPage[]>;
  getBaaniPageById(id: string): Promise<BaaniPage | null>;
  getBaaniPageByNumber(pageNumber: number): Promise<BaaniPage | null>;
  
  // Gurdwaras
  getGurdwaras(): Promise<Gurdwara[]>;
  getGurdwaraById(id: string): Promise<Gurdwara | null>;
  
  // Resources
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  
  // Audio
  getAudioTracks(): Promise<AudioTrack[]>;
}

// Load Gurdwara data from JSON file
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { baaniPages as baaniPagesList } from "./baani-pages-data.js";
import { audioTracks as audioTracksList } from "./audio-data.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadGurdwaraData(): Gurdwara[] {
  try {
    const dataPath = path.join(__dirname, "gurdwara-data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const gurdwaras = JSON.parse(rawData) as Array<{
      id: string;
      name: string;
      content: string;
      pdfFileName: string | null;
      chronologicalOrder?: number;
      visitDate?: string;
    }>;

    // Manual PDF mapping based on file names in attached_assets
    // Mapping gurdwara IDs from JSON to available PDF files
    const pdfMap: Record<string, string[]> = {
      "gurdwara-tegh-bahadur-sahib-bahadurgarh": ["ਗੁਰਦੁਆਰਾ ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਪਾਤਸ਼ਾਹੀ ਨੌਵੀਂ ਬਹਾਦਰਗੜ੍ਹ _1763096532039.pdf", "ਕਿਲ੍ਹਾ, ਬਹਾਦਰਗੜ੍ਹ _1763096532051.pdf"],
      "gurdwara-damdama-sahib-talwandi-sabo": ["Gurdwara Sahib Tamsimbli_1763096532024.pdf"],
    };

    // Image mapping for gurdwaras
    const imageMap: Record<string, string> = {
      "gurdwara-guru-ke-mahil": "/attached_assets/stock_images/golden_temple_amrits_5a97710a.jpg",
      "gurdwara-sis-ganj-sahib-delhi": "/attached_assets/stock_images/historic_sikh_gurdwa_e4790ed3.jpg",
      "gurdwara-rakab-ganj-sahib": "/attached_assets/stock_images/historic_sikh_gurdwa_ed04d20f.jpg",
      "gurdwara-sis-ganj-sahib-anandpur": "/attached_assets/stock_images/golden_temple_amrits_b2dcace7.jpg",
      "gurdwara-anandpur-sahib": "/attached_assets/stock_images/historic_sikh_gurdwa_93551c79.jpg",
      "gurdwara-sahib-bakala": "/attached_assets/stock_images/historic_sikh_gurdwa_31e75390.jpg",
      "takht-sri-patna-sahib": "/attached_assets/stock_images/historic_sikh_gurdwa_18088cc8.jpg",
      "gurdwara-damdama-sahib-dhubri": "/attached_assets/stock_images/golden_temple_amrits_e2318cb3.jpg",
      "gurdwara-tegh-bahadur-sahib-kurukshetra": "/attached_assets/stock_images/golden_temple_amrits_5a97710a.jpg",
      "gurdwara-tegh-bahadur-sahib-bahadurgarh": "/attached_assets/stock_images/historic_sikh_gurdwa_e4790ed3.jpg",
      "gurdwara-damdama-sahib-talwandi-sabo": "/attached_assets/stock_images/historic_sikh_gurdwa_ed04d20f.jpg",
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
      
      return {
        id: g.id,
        name: g.name,
        imageUrl: imageMap[g.id] || "/attached_assets/stock_images/golden_temple_amrits_5a97710a.jpg",
        briefHistory,
        fullHistory: g.content,
        location: {
          address: location,
          mapEmbedUrl: undefined,
        },
        pdfAssets: pdfAssets.length > 0 ? pdfAssets : undefined,
        visitDate: g.visitDate,
        chronologicalOrder: g.chronologicalOrder || 999,
      };
    })
    .sort((a, b) => (a.chronologicalOrder || 999) - (b.chronologicalOrder || 999));
  } catch (error) {
    console.error("Error loading gurdwara data:", error);
    return [];
  }
}

export class MemStorage implements IStorage {
  private baaniPages: BaaniPage[] = baaniPagesList;
  
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
      content: `ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਦਾ ਜਨਮ 1 ਅਪ੍ਰੈਲ 1621 ਦਿਨ ਐਤਵਾਰ ਨੂੰ ਮਾਤਾ ਨਾਨਕੀ ਜੀ ਦੀ ਕੁੱਖੋਂ ਅੰਮ੍ਰਿਤਸਰ ਵਿਖੇ ਗੁਰਦਵਾਰਾ ਗੁਰੂ ਕੇ ਮਹਿਲ ਦੇ ਸਥਾਨ ਤੇ ਹੋਇਆ। ਆਪ ਜੀ ਛੇਵੇਂ ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ ਦੇ ਪੰਜਵੇਂ ਅਤੇ ਸੱਭ ਤੋਂ ਛੋਟੇ ਪੁੱਤਰ ਸਨ। ਬਚਪਨ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਨਾਮ ਤਿਆਗ ਮੱਲ ਸੀ।

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


  private gurdwaras: Gurdwara[] = loadGurdwaraData(); 

  private resources: Resource[] = [
    {
      id: "resource-biography",
      title: "ਸੰਪੂਰਨ ਜੀਵਨੀ",
      description: "ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਦੀ ਵਿਸਥਾਰ ਜੀਵਨੀ, ਜਨਮ ਤੋਂ ਸ਼ਹੀਦੀ ਤੱਕ",
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
      description: "ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ ਦੀਆਂ ਬਾਣੀਆਂ ਦੇ ਅਰਥ ਅਤੇ ਟੀਕਾ",
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

  async getBaaniPages(): Promise<BaaniPage[]> {
    return this.baaniPages;
  }

  async getBaaniPageById(id: string): Promise<BaaniPage | null> {
    return this.baaniPages.find(p => p.id === id) || null;
  }

  async getBaaniPageByNumber(pageNumber: number): Promise<BaaniPage | null> {
    return this.baaniPages.find(p => p.pageNumber === pageNumber) || null;
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

  async getAudioTracks(): Promise<AudioTrack[]> {
    return audioTracksList;
  }
}

export const storage = new MemStorage();
