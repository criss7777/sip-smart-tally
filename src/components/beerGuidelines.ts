
export const beerGuidelines = [
  {
    type: "Light Lager",
    range: "3.5–4.5%",
    limit: { male: 600, female: 400 }
  },
  {
    type: "Regular Lager",
    range: "5.0%",
    limit: { male: 500, female: 330 }
  },
  {
    type: "Strong Lager",
    range: "6–7%",
    limit: { male: 400, female: 300 }
  },
  {
    type: "IPA/Craft",
    range: "6–8%",
    limit: { male: 330, female: 250 }
  },
  {
    type: "Stout/Dark Beer",
    range: "5–7%",
    limit: { male: 400, female: 300 }
  },
  {
    type: "Wheat Beer",
    range: "5.3%",
    limit: { male: 400, female: 300 }
  },
  {
    type: "Alcohol-free",
    range: "<0.5%",
    limit: { male: -1, female: -1 }
  }
];

export function findBeerGuideline(alcoholPercentage: string, beerType: string) {
  const percentNum = parseFloat(alcoholPercentage.replace(/[^\d.]/g, ""));
  if (beerType?.toLowerCase().includes("ipa")) return beerGuidelines.find(g => g.type === "IPA/Craft");
  if (beerType?.toLowerCase().includes("wheat")) return beerGuidelines.find(g => g.type === "Wheat Beer");
  if (beerType?.toLowerCase().includes("stout")) return beerGuidelines.find(g => g.type === "Stout/Dark Beer");
  if (percentNum <= 4.5) return beerGuidelines[0];
  if (percentNum === 5) return beerGuidelines[1];
  if (percentNum > 5 && percentNum <= 5.4) return beerType?.toLowerCase().includes("wheat") ? beerGuidelines[5] : beerGuidelines[1];
  if (percentNum >= 6 && percentNum <= 7) return beerGuidelines[2];
  if (percentNum > 7) return beerGuidelines[3];
  if (/alkoh.*free|<0.\d+/.test(alcoholPercentage.toLowerCase())) return beerGuidelines[6];
  return undefined;
}
