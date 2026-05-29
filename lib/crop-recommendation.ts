// Smart Grow AI - Crop Recommendation Engine
// This engine analyzes soil type, environmental conditions, and market trends
// to recommend the best crops for farmers

import type { CropRecommendation, EnvironmentalData, FarmerProfile } from "./types"

// Crop database with suitability scores for different conditions
interface CropData {
  name: string
  idealSoilTypes: string[]
  temperatureRange: { min: number; max: number }
  rainfallRange: { min: number; max: number }
  phRange: { min: number; max: number }
  humidityRange: { min: number; max: number }
  nitrogenRequirement: "low" | "medium" | "high"
  growingSeason: string
  daysToHarvest: number
  avgYieldPerAcre: string
  avgPricePerKg: number
  marketDemand: "high" | "medium" | "low"
  marketTrendScore: number // 1-10, higher = better market opportunity
}

const CROP_DATABASE: CropData[] = [
  {
    name: "Tomato",
    idealSoilTypes: ["loamy", "sandy", "clay"],
    temperatureRange: { min: 20, max: 30 },
    rainfallRange: { min: 40, max: 100 },
    phRange: { min: 6.0, max: 7.0 },
    humidityRange: { min: 50, max: 80 },
    nitrogenRequirement: "high",
    growingSeason: "Kharif/Rabi (Year-round)",
    daysToHarvest: 75,
    avgYieldPerAcre: "8-12 tonnes",
    avgPricePerKg: 35,
    marketDemand: "high",
    marketTrendScore: 9,
  },
  {
    name: "Wheat",
    idealSoilTypes: ["loamy", "clay", "silty"],
    temperatureRange: { min: 12, max: 25 },
    rainfallRange: { min: 25, max: 75 },
    phRange: { min: 6.0, max: 7.5 },
    humidityRange: { min: 40, max: 70 },
    nitrogenRequirement: "high",
    growingSeason: "Rabi (Oct-Mar)",
    daysToHarvest: 120,
    avgYieldPerAcre: "1.5-2 tonnes",
    avgPricePerKg: 25,
    marketDemand: "high",
    marketTrendScore: 8,
  },
  {
    name: "Rice (Paddy)",
    idealSoilTypes: ["clay", "loamy", "silty"],
    temperatureRange: { min: 22, max: 35 },
    rainfallRange: { min: 100, max: 200 },
    phRange: { min: 5.5, max: 7.0 },
    humidityRange: { min: 70, max: 90 },
    nitrogenRequirement: "high",
    growingSeason: "Kharif (Jun-Nov)",
    daysToHarvest: 130,
    avgYieldPerAcre: "2-3 tonnes",
    avgPricePerKg: 20,
    marketDemand: "high",
    marketTrendScore: 7,
  },
  {
    name: "Potato",
    idealSoilTypes: ["loamy", "sandy", "silty"],
    temperatureRange: { min: 15, max: 25 },
    rainfallRange: { min: 30, max: 60 },
    phRange: { min: 5.0, max: 6.5 },
    humidityRange: { min: 60, max: 80 },
    nitrogenRequirement: "medium",
    growingSeason: "Rabi (Oct-Feb)",
    daysToHarvest: 90,
    avgYieldPerAcre: "10-15 tonnes",
    avgPricePerKg: 15,
    marketDemand: "high",
    marketTrendScore: 8,
  },
  {
    name: "Onion",
    idealSoilTypes: ["loamy", "sandy", "silty"],
    temperatureRange: { min: 13, max: 28 },
    rainfallRange: { min: 30, max: 70 },
    phRange: { min: 6.0, max: 7.5 },
    humidityRange: { min: 50, max: 70 },
    nitrogenRequirement: "medium",
    growingSeason: "Kharif/Rabi",
    daysToHarvest: 150,
    avgYieldPerAcre: "8-12 tonnes",
    avgPricePerKg: 25,
    marketDemand: "high",
    marketTrendScore: 9,
  },
  {
    name: "Cotton",
    idealSoilTypes: ["clay", "loamy"],
    temperatureRange: { min: 21, max: 35 },
    rainfallRange: { min: 50, max: 100 },
    phRange: { min: 6.0, max: 8.0 },
    humidityRange: { min: 40, max: 60 },
    nitrogenRequirement: "medium",
    growingSeason: "Kharif (Apr-Oct)",
    daysToHarvest: 180,
    avgYieldPerAcre: "400-600 kg lint",
    avgPricePerKg: 65,
    marketDemand: "medium",
    marketTrendScore: 7,
  },
  {
    name: "Sugarcane",
    idealSoilTypes: ["loamy", "clay"],
    temperatureRange: { min: 20, max: 35 },
    rainfallRange: { min: 75, max: 150 },
    phRange: { min: 6.0, max: 8.0 },
    humidityRange: { min: 70, max: 85 },
    nitrogenRequirement: "high",
    growingSeason: "Year-round",
    daysToHarvest: 365,
    avgYieldPerAcre: "30-40 tonnes",
    avgPricePerKg: 3.5,
    marketDemand: "medium",
    marketTrendScore: 6,
  },
  {
    name: "Chilli (Mirchi)",
    idealSoilTypes: ["loamy", "sandy"],
    temperatureRange: { min: 20, max: 30 },
    rainfallRange: { min: 50, max: 100 },
    phRange: { min: 6.0, max: 7.0 },
    humidityRange: { min: 60, max: 70 },
    nitrogenRequirement: "medium",
    growingSeason: "Kharif/Rabi",
    daysToHarvest: 90,
    avgYieldPerAcre: "1-2 tonnes (dry)",
    avgPricePerKg: 120,
    marketDemand: "high",
    marketTrendScore: 8,
  },
  {
    name: "Turmeric",
    idealSoilTypes: ["loamy", "clay"],
    temperatureRange: { min: 20, max: 35 },
    rainfallRange: { min: 100, max: 200 },
    phRange: { min: 5.5, max: 7.5 },
    humidityRange: { min: 70, max: 90 },
    nitrogenRequirement: "high",
    growingSeason: "Kharif (Jun-Mar)",
    daysToHarvest: 270,
    avgYieldPerAcre: "6-8 tonnes (fresh)",
    avgPricePerKg: 80,
    marketDemand: "high",
    marketTrendScore: 9,
  },
  {
    name: "Maize (Corn)",
    idealSoilTypes: ["loamy", "sandy", "silty"],
    temperatureRange: { min: 18, max: 32 },
    rainfallRange: { min: 50, max: 100 },
    phRange: { min: 5.5, max: 7.5 },
    humidityRange: { min: 50, max: 75 },
    nitrogenRequirement: "high",
    growingSeason: "Kharif/Rabi",
    daysToHarvest: 100,
    avgYieldPerAcre: "2-3 tonnes",
    avgPricePerKg: 18,
    marketDemand: "medium",
    marketTrendScore: 7,
  },
  {
    name: "Soybean",
    idealSoilTypes: ["loamy", "clay"],
    temperatureRange: { min: 20, max: 30 },
    rainfallRange: { min: 50, max: 100 },
    phRange: { min: 6.0, max: 7.0 },
    humidityRange: { min: 60, max: 80 },
    nitrogenRequirement: "low",
    growingSeason: "Kharif (Jun-Oct)",
    daysToHarvest: 100,
    avgYieldPerAcre: "1-1.5 tonnes",
    avgPricePerKg: 45,
    marketDemand: "medium",
    marketTrendScore: 7,
  },
  {
    name: "Mustard",
    idealSoilTypes: ["loamy", "sandy"],
    temperatureRange: { min: 10, max: 25 },
    rainfallRange: { min: 25, max: 50 },
    phRange: { min: 6.0, max: 7.5 },
    humidityRange: { min: 40, max: 60 },
    nitrogenRequirement: "medium",
    growingSeason: "Rabi (Oct-Feb)",
    daysToHarvest: 120,
    avgYieldPerAcre: "500-800 kg",
    avgPricePerKg: 55,
    marketDemand: "medium",
    marketTrendScore: 6,
  },
  {
    name: "Groundnut (Peanut)",
    idealSoilTypes: ["sandy", "loamy"],
    temperatureRange: { min: 22, max: 35 },
    rainfallRange: { min: 40, max: 80 },
    phRange: { min: 6.0, max: 7.0 },
    humidityRange: { min: 50, max: 70 },
    nitrogenRequirement: "low",
    growingSeason: "Kharif (Jun-Nov)",
    daysToHarvest: 130,
    avgYieldPerAcre: "1-1.5 tonnes",
    avgPricePerKg: 60,
    marketDemand: "high",
    marketTrendScore: 8,
  },
  {
    name: "Cabbage",
    idealSoilTypes: ["loamy", "clay", "silty"],
    temperatureRange: { min: 12, max: 24 },
    rainfallRange: { min: 40, max: 80 },
    phRange: { min: 6.0, max: 7.5 },
    humidityRange: { min: 60, max: 80 },
    nitrogenRequirement: "high",
    growingSeason: "Rabi (Oct-Mar)",
    daysToHarvest: 90,
    avgYieldPerAcre: "12-20 tonnes",
    avgPricePerKg: 12,
    marketDemand: "medium",
    marketTrendScore: 6,
  },
  {
    name: "Cauliflower",
    idealSoilTypes: ["loamy", "silty"],
    temperatureRange: { min: 15, max: 22 },
    rainfallRange: { min: 40, max: 70 },
    phRange: { min: 6.0, max: 7.0 },
    humidityRange: { min: 60, max: 80 },
    nitrogenRequirement: "high",
    growingSeason: "Rabi (Oct-Mar)",
    daysToHarvest: 85,
    avgYieldPerAcre: "10-15 tonnes",
    avgPricePerKg: 25,
    marketDemand: "medium",
    marketTrendScore: 7,
  },
]

// Simulated environmental data based on Indian regions and seasons
function getSimulatedEnvironmentalData(state: string, _district: string): EnvironmentalData {
  // Regional climate patterns for India
  const regionalData: Record<string, Partial<EnvironmentalData>> = {
    Maharashtra: {
      temperature: 28,
      humidity: 65,
      rainfall: 100,
      nitrogen: 250,
      phosphorus: 35,
      potassium: 200,
      ph: 6.5,
    },
    Punjab: { temperature: 25, humidity: 55, rainfall: 50, nitrogen: 280, phosphorus: 40, potassium: 220, ph: 7.2 },
    Karnataka: { temperature: 27, humidity: 70, rainfall: 90, nitrogen: 240, phosphorus: 32, potassium: 190, ph: 6.3 },
    "Tamil Nadu": {
      temperature: 30,
      humidity: 75,
      rainfall: 85,
      nitrogen: 230,
      phosphorus: 30,
      potassium: 185,
      ph: 6.8,
    },
    "Uttar Pradesh": {
      temperature: 26,
      humidity: 60,
      rainfall: 75,
      nitrogen: 260,
      phosphorus: 38,
      potassium: 210,
      ph: 7.0,
    },
    Gujarat: { temperature: 29, humidity: 50, rainfall: 55, nitrogen: 220, phosphorus: 28, potassium: 180, ph: 7.5 },
    "Madhya Pradesh": {
      temperature: 27,
      humidity: 55,
      rainfall: 95,
      nitrogen: 245,
      phosphorus: 34,
      potassium: 195,
      ph: 6.7,
    },
    Rajasthan: { temperature: 30, humidity: 35, rainfall: 30, nitrogen: 180, phosphorus: 22, potassium: 150, ph: 7.8 },
    "West Bengal": {
      temperature: 28,
      humidity: 80,
      rainfall: 150,
      nitrogen: 270,
      phosphorus: 36,
      potassium: 205,
      ph: 6.2,
    },
    Bihar: { temperature: 27, humidity: 70, rainfall: 110, nitrogen: 255, phosphorus: 33, potassium: 195, ph: 6.9 },
    default: { temperature: 27, humidity: 65, rainfall: 80, nitrogen: 240, phosphorus: 32, potassium: 190, ph: 6.5 },
  }

  const baseData = regionalData[state] || regionalData.default

  // Add some randomness to simulate real-world variation (±10%)
  const randomize = (value: number) => value * (0.9 + Math.random() * 0.2)

  return {
    temperature: Math.round(randomize(baseData.temperature!)),
    humidity: Math.round(randomize(baseData.humidity!)),
    rainfall: Math.round(randomize(baseData.rainfall!)),
    nitrogen: Math.round(randomize(baseData.nitrogen!)),
    phosphorus: Math.round(randomize(baseData.phosphorus!)),
    potassium: Math.round(randomize(baseData.potassium!)),
    ph: Math.round(randomize(baseData.ph!) * 10) / 10,
  }
}

// Calculate suitability score for a crop based on conditions
function calculateSuitabilityScore(crop: CropData, soilType: string, envData: EnvironmentalData): number {
  let score = 0
  const weights = {
    soil: 25,
    temperature: 20,
    rainfall: 15,
    ph: 15,
    humidity: 10,
    nitrogen: 10,
    market: 5,
  }

  // Soil type match (0-25 points)
  if (crop.idealSoilTypes.includes(soilType)) {
    score += weights.soil
  } else if (crop.idealSoilTypes.some((s) => s === "loamy" || s === "sandy")) {
    score += weights.soil * 0.5 // Partial match for versatile crops
  }

  // Temperature match (0-20 points)
  if (envData.temperature >= crop.temperatureRange.min && envData.temperature <= crop.temperatureRange.max) {
    score += weights.temperature
  } else {
    const tempDiff = Math.min(
      Math.abs(envData.temperature - crop.temperatureRange.min),
      Math.abs(envData.temperature - crop.temperatureRange.max),
    )
    score += Math.max(0, weights.temperature - tempDiff * 2)
  }

  // Rainfall match (0-15 points)
  if (envData.rainfall >= crop.rainfallRange.min && envData.rainfall <= crop.rainfallRange.max) {
    score += weights.rainfall
  } else {
    const rainDiff =
      Math.min(
        Math.abs(envData.rainfall - crop.rainfallRange.min),
        Math.abs(envData.rainfall - crop.rainfallRange.max),
      ) / 10
    score += Math.max(0, weights.rainfall - rainDiff)
  }

  // pH match (0-15 points)
  if (envData.ph >= crop.phRange.min && envData.ph <= crop.phRange.max) {
    score += weights.ph
  } else {
    const phDiff = Math.min(Math.abs(envData.ph - crop.phRange.min), Math.abs(envData.ph - crop.phRange.max))
    score += Math.max(0, weights.ph - phDiff * 5)
  }

  // Humidity match (0-10 points)
  if (envData.humidity >= crop.humidityRange.min && envData.humidity <= crop.humidityRange.max) {
    score += weights.humidity
  } else {
    const humDiff = Math.min(
      Math.abs(envData.humidity - crop.humidityRange.min),
      Math.abs(envData.humidity - crop.humidityRange.max),
    )
    score += Math.max(0, weights.humidity - humDiff / 5)
  }

  // Nitrogen levels (0-10 points)
  const nitrogenThresholds = { low: 200, medium: 250, high: 300 }
  const requiredNitrogen = nitrogenThresholds[crop.nitrogenRequirement]
  if (envData.nitrogen >= requiredNitrogen * 0.8) {
    score += weights.nitrogen
  } else {
    score += (envData.nitrogen / requiredNitrogen) * weights.nitrogen
  }

  // Market trend bonus (0-5 points)
  score += (crop.marketTrendScore / 10) * weights.market

  return Math.min(100, Math.round(score))
}

// Generate reasoning for the recommendation
function generateReasoning(crop: CropData, soilType: string, envData: EnvironmentalData, score: number): string {
  const reasons: string[] = []

  if (crop.idealSoilTypes.includes(soilType)) {
    reasons.push(`${soilType.charAt(0).toUpperCase() + soilType.slice(1)} soil is ideal for ${crop.name}`)
  }

  if (envData.temperature >= crop.temperatureRange.min && envData.temperature <= crop.temperatureRange.max) {
    reasons.push(`Current temperature (${envData.temperature}°C) is optimal`)
  }

  if (crop.marketDemand === "high") {
    reasons.push("High market demand ensures good selling prices")
  }

  if (crop.marketTrendScore >= 8) {
    reasons.push("Strong market trends indicate profitable opportunity")
  }

  if (envData.rainfall >= crop.rainfallRange.min && envData.rainfall <= crop.rainfallRange.max) {
    reasons.push("Rainfall patterns are favorable")
  }

  return reasons.slice(0, 3).join(". ") + "."
}

// Main recommendation function
export function getCropRecommendations(profile: FarmerProfile): {
  recommendations: CropRecommendation[]
  environmentalData: EnvironmentalData
} {
  const envData = getSimulatedEnvironmentalData(profile.state, profile.district)

  const scoredCrops = CROP_DATABASE.map((crop) => {
    const suitabilityScore = calculateSuitabilityScore(crop, profile.soilType, envData)
    return {
      crop,
      score: suitabilityScore,
    }
  }).sort((a, b) => b.score - a.score)

  const topCrops = scoredCrops.slice(0, 3)

  const recommendations: CropRecommendation[] = topCrops.map(({ crop, score }) => ({
    cropName: crop.name,
    suitabilityScore: score,
    marketDemand: crop.marketDemand,
    expectedYield: crop.avgYieldPerAcre,
    estimatedRevenue: `₹${Math.round(crop.avgPricePerKg * Number.parseFloat(crop.avgYieldPerAcre.split("-")[0]) * 1000).toLocaleString("en-IN")} - ₹${Math.round(crop.avgPricePerKg * Number.parseFloat(crop.avgYieldPerAcre.split("-")[1] || crop.avgYieldPerAcre.split("-")[0]) * 1000).toLocaleString("en-IN")} per acre`,
    growingSeason: crop.growingSeason,
    reasoning: generateReasoning(crop, profile.soilType, envData, score),
  }))

  return {
    recommendations,
    environmentalData: envData,
  }
}
