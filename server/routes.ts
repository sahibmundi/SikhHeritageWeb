import type { Express } from "express";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  // Biography endpoints
  app.get("/api/biography/timeline", async (req, res) => {
    try {
      const timeline = await storage.getTimeline();
      res.json(timeline);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  app.get("/api/biography/sections", async (req, res) => {
    try {
      const sections = await storage.getBiographySections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch biography sections" });
    }
  });

  // Shabads endpoints
  app.get("/api/shabads", async (req, res) => {
    try {
      const shabads = await storage.getShabads();
      res.json(shabads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shabads" });
    }
  });

  app.get("/api/shabads/:id", async (req, res) => {
    try {
      const shabad = await storage.getShabadById(req.params.id);
      if (!shabad) {
        res.status(404).json({ error: "Shabad not found" });
        return;
      }
      res.json(shabad);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shabad" });
    }
  });

  // Gurdwaras endpoints
  app.get("/api/gurdwaras", async (req, res) => {
    try {
      const gurdwaras = await storage.getGurdwaras();
      res.json(gurdwaras);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gurdwaras" });
    }
  });

  app.get("/api/gurdwaras/:id", async (req, res) => {
    try {
      const gurdwara = await storage.getGurdwaraById(req.params.id);
      if (!gurdwara) {
        res.status(404).json({ error: "Gurdwara not found" });
        return;
      }
      res.json(gurdwara);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gurdwara" });
    }
  });

  // Resources endpoints
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      if (category && typeof category === "string") {
        const resources = await storage.getResourcesByCategory(category);
        res.json(resources);
      } else {
        const resources = await storage.getResources();
        res.json(resources);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });
}
