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
    mood: string;
    significance: string;
  };
  audioUrl?: string;
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
}

// Resource Type
export interface Resource {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  category: string;
}

// Export types for use in components
export type {
  TimelineEvent,
  BiographySection,
  Shabad,
  Gurdwara,
  PdfAsset,
  Resource
};
