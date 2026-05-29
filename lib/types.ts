// Core types for AgroHub

export type UserRole = "farmer" | "buyer"

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  phone: string
  createdAt: string
}

export interface FarmerProfile {
  userId: string
  farmSize: number
  farmSizeUnit: "acres" | "hectares"
  soilType: "loamy" | "clay" | "sandy" | "silty" | "peaty" | "chalky"
  location: string
  state: string
  district: string
  pincode: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Product {
  id: string
  farmerId: string
  farmerName: string
  name: string
  description: string
  category: string
  price: number
  quantity: number
  unit: "kg" | "quintal" | "dozen" | "piece"
  image: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  productId: string
  quantity: number
  product: Product
}

export interface Order {
  id: string
  buyerId: string
  buyerName: string
  buyerPhone: string
  items: {
    productId: string
    productName: string
    quantity: number
    price: number
    farmerId: string
    farmerName: string
  }[]
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "cod" | "online"
  shippingAddress: string
  createdAt: string
}

export interface CropRecommendation {
  cropName: string
  suitabilityScore: number
  marketDemand: "high" | "medium" | "low"
  expectedYield: string
  estimatedRevenue: string
  growingSeason: string
  reasoning: string
}

export interface EnvironmentalData {
  temperature: number
  humidity: number
  rainfall: number
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
}
