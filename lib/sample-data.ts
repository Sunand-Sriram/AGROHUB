// Sample products for demonstration purposes
import { addProduct, getProducts, generateId } from "./store"
import type { Product } from "./types"

const SAMPLE_PRODUCTS: Omit<Product, "id" | "createdAt" | "updatedAt">[] = [
  {
    farmerId: "sample-farmer-1",
    farmerName: "Ramesh Kumar",
    name: "Fresh Tomatoes",
    description:
      "Organically grown, vine-ripened tomatoes from our family farm in Maharashtra. Perfect for cooking and salads.",
    category: "Vegetables",
    price: 40,
    quantity: 500,
    unit: "kg",
    image: "/fresh-red-tomatoes.jpg",
  },
  {
    farmerId: "sample-farmer-1",
    farmerName: "Ramesh Kumar",
    name: "Basmati Rice",
    description: "Premium long-grain Basmati rice from Punjab. Aromatic and perfect for biryani and pulao.",
    category: "Grains & Cereals",
    price: 120,
    quantity: 1000,
    unit: "kg",
    image: "/basmati-rice-grains.jpg",
  },
  {
    farmerId: "sample-farmer-2",
    farmerName: "Priya Sharma",
    name: "Green Chillies",
    description: "Spicy green chillies, freshly harvested. Adds perfect heat to any dish.",
    category: "Vegetables",
    price: 80,
    quantity: 200,
    unit: "kg",
    image: "/green-chillies.jpg",
  },
  {
    farmerId: "sample-farmer-2",
    farmerName: "Priya Sharma",
    name: "Alphonso Mangoes",
    description: "Premium Alphonso mangoes from Ratnagiri. Sweet, aromatic, and perfect for the season.",
    category: "Fruits",
    price: 600,
    quantity: 100,
    unit: "dozen",
    image: "/alphonso-mangoes.jpg",
  },
  {
    farmerId: "sample-farmer-3",
    farmerName: "Suresh Patel",
    name: "Fresh Potatoes",
    description: "Farm-fresh potatoes from Gujarat. Ideal for all types of cooking.",
    category: "Vegetables",
    price: 25,
    quantity: 800,
    unit: "kg",
    image: "/fresh-potatoes.png",
  },
  {
    farmerId: "sample-farmer-3",
    farmerName: "Suresh Patel",
    name: "Organic Turmeric",
    description: "High-curcumin organic turmeric powder. Excellent for health and cooking.",
    category: "Spices",
    price: 200,
    quantity: 50,
    unit: "kg",
    image: "/turmeric-powder.png",
  },
  {
    farmerId: "sample-farmer-4",
    farmerName: "Lakshmi Devi",
    name: "Fresh Onions",
    description: "Red onions from Nashik. Essential ingredient for Indian cooking.",
    category: "Vegetables",
    price: 35,
    quantity: 600,
    unit: "kg",
    image: "/red-onions.jpg",
  },
  {
    farmerId: "sample-farmer-4",
    farmerName: "Lakshmi Devi",
    name: "Moong Dal",
    description: "Premium quality split moong dal. High protein, easy to digest.",
    category: "Pulses & Lentils",
    price: 140,
    quantity: 300,
    unit: "kg",
    image: "/moong-dal-lentils.jpg",
  },
  {
    farmerId: "sample-farmer-5",
    farmerName: "Venkat Rao",
    name: "Fresh Cauliflower",
    description: "White, fresh cauliflower heads. Perfect for gobi dishes.",
    category: "Vegetables",
    price: 30,
    quantity: 200,
    unit: "piece",
    image: "/fresh-cauliflower.jpg",
  },
  {
    farmerId: "sample-farmer-5",
    farmerName: "Venkat Rao",
    name: "Groundnuts",
    description: "Fresh groundnuts from Andhra Pradesh. Great for snacking and cooking.",
    category: "Other",
    price: 90,
    quantity: 400,
    unit: "kg",
    image: "/groundnuts-peanuts.jpg",
  },
  {
    farmerId: "sample-farmer-1",
    farmerName: "Ramesh Kumar",
    name: "Fresh Coriander",
    description: "Aromatic fresh coriander leaves. Essential garnish for Indian dishes.",
    category: "Vegetables",
    price: 60,
    quantity: 100,
    unit: "kg",
    image: "/fresh-coriander-leaves.jpg",
  },
  {
    farmerId: "sample-farmer-2",
    farmerName: "Priya Sharma",
    name: "Cumin Seeds",
    description: "Whole cumin seeds with strong aroma. Essential spice for tempering.",
    category: "Spices",
    price: 280,
    quantity: 80,
    unit: "kg",
    image: "/cumin-seeds-jeera.jpg",
  },
]

export function initializeSampleData() {
  const existingProducts = getProducts()
  if (existingProducts.length === 0) {
    const now = new Date().toISOString()
    SAMPLE_PRODUCTS.forEach((product) => {
      addProduct({
        ...product,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      })
    })
  }
}
