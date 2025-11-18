import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Timeline Event Type
export interface TimelineEvent {
  year: string;
  label: string;
  sectionId: string;
}

// Biography Section Type
export interface BiographySection {
  id: string;
  heading: string;
  content: string;
}

// Raag Information Type
export interface RaagInfo {
  id: string;
  name: string;
  nameEnglish: string;
  time: string;
  ras: string;
  significance: string;
  shabadCount: number;
  description: string;
}

// Shabad Type
export interface Shabad {
  id: string;
  title: string;
  gurmukhi: string;
  meaning: string;
  teeka: string;
  raag: {
    name: string;
    time: string;
    ras: string;
    significance: string;
  };
  raagId?: string;
  audioUrl?: string;
  pageNumber?: number;
}

// PDF Asset Type
export interface PdfAsset {
  label: string;
  fileName: string;
}

// Gurdwara Type
export interface Gurdwara {
  id: string;
  name: string;
  imageUrl?: string;
  briefHistory: string;
  fullHistory: string;
  location: {
    address: string;
    mapEmbedUrl?: string;
  };
  pdfAssets?: PdfAsset[];
  visitDate?: string;
  chronologicalOrder?: number;
}

// Resource Type
export interface Resource {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  category: string;
}

// Audio Track Type
export interface AudioTrack {
  id: string;
  title: string;
  raagId: string;
  shabadId?: string;
  performer: string;
  duration: string;
  audioUrl: string;
  description: string;
}
