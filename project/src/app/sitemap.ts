import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://virtually-yours.nl";

  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/documenten`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pakketten`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/hoe-werkt-het`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/over-mij`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/coaching-va`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/juridisch-va`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/nieuws`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/algemene-voorwaarden`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/privacyverklaring`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
