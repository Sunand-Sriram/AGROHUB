// Simple client-side store using localStorage for demo purposes

import type { User, FarmerProfile, Product, CartItem, Order } from "./types"

const STORAGE_KEYS = {
  USERS: "agrohub_users",
  FARMER_PROFILES: "agrohub_farmer_profiles",
  PRODUCTS: "agrohub_products",
  CART: "agrohub_cart", // This will now be a prefix for user-specific carts
  ORDERS: "agrohub_orders",
  CURRENT_USER: "agrohub_current_user",
}

// Helper to safely parse JSON from localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// User operations
export function getUsers(): User[] {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, [])
}

export function addUser(user: User): void {
  const users = getUsers()
  users.push(user)
  setToStorage(STORAGE_KEYS.USERS, users)
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email)
}

export function getCurrentUser(): User | null {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
}

export function setCurrentUser(user: User | null): void {
  setToStorage(STORAGE_KEYS.CURRENT_USER, user)
}

// Farmer Profile operations
export function getFarmerProfiles(): FarmerProfile[] {
  return getFromStorage<FarmerProfile[]>(STORAGE_KEYS.FARMER_PROFILES, [])
}

export function getFarmerProfile(userId: string): FarmerProfile | undefined {
  return getFarmerProfiles().find((p) => p.userId === userId)
}

export function saveFarmerProfile(profile: FarmerProfile): void {
  const profiles = getFarmerProfiles()
  const index = profiles.findIndex((p) => p.userId === profile.userId)
  if (index >= 0) {
    profiles[index] = profile
  } else {
    profiles.push(profile)
  }
  setToStorage(STORAGE_KEYS.FARMER_PROFILES, profiles)
}

// Product operations
export function getProducts(): Product[] {
  return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, [])
}

export function getProductsByFarmer(farmerId: string): Product[] {
  return getProducts().filter((p) => p.farmerId === farmerId)
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id)
}

export function addProduct(product: Product): void {
  const products = getProducts()
  products.push(product)
  setToStorage(STORAGE_KEYS.PRODUCTS, products)
}

export function updateProduct(product: Product): void {
  const products = getProducts()
  const index = products.findIndex((p) => p.id === product.id)
  if (index >= 0) {
    products[index] = product
    setToStorage(STORAGE_KEYS.PRODUCTS, products)
  }
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p) => p.id !== id)
  setToStorage(STORAGE_KEYS.PRODUCTS, products)
}

// Cart operations
function getCartKey(userId: string): string {
  return `${STORAGE_KEYS.CART}_${userId}`
}

export function getCart(userId?: string): CartItem[] {
  if (!userId) return []
  return getFromStorage<CartItem[]>(getCartKey(userId), [])
}

export function addToCart(item: CartItem, userId?: string): void {
  if (!userId) return
  const cart = getCart(userId)
  const existingIndex = cart.findIndex((c) => c.productId === item.productId)
  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity
  } else {
    cart.push(item)
  }
  setToStorage(getCartKey(userId), cart)
}

export function updateCartItem(productId: string, quantity: number, userId?: string): void {
  if (!userId) return
  const cart = getCart(userId)
  const index = cart.findIndex((c) => c.productId === productId)
  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1)
    } else {
      cart[index].quantity = quantity
    }
    setToStorage(getCartKey(userId), cart)
  }
}

export function removeFromCart(productId: string, userId?: string): void {
  if (!userId) return
  const cart = getCart(userId).filter((c) => c.productId !== productId)
  setToStorage(getCartKey(userId), cart)
}

export function clearCart(userId?: string): void {
  if (!userId) return
  setToStorage(getCartKey(userId), [])
}

// Order operations
export function getOrders(): Order[] {
  return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, [])
}

export function getOrdersByBuyer(buyerId: string): Order[] {
  return getOrders().filter((o) => o.buyerId === buyerId)
}

export function getOrdersByFarmer(farmerId: string): Order[] {
  return getOrders().filter((o) => o.items.some((item) => item.farmerId === farmerId))
}

export function addOrder(order: Order): void {
  const orders = getOrders()
  orders.push(order)
  setToStorage(STORAGE_KEYS.ORDERS, orders)
}

export function updateOrderStatus(orderId: string, status: Order["status"]): void {
  const orders = getOrders()
  const index = orders.findIndex((o) => o.id === orderId)
  if (index >= 0) {
    orders[index].status = status
    setToStorage(STORAGE_KEYS.ORDERS, orders)
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
