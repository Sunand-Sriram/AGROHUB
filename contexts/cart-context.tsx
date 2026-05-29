"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem } from "@/lib/types"
import {
  getCart,
  addToCart as addToCartStore,
  updateCartItem,
  removeFromCart,
  clearCart,
  getProductById,
} from "@/lib/store"
import { useAuth } from "./auth-context"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalAmount: number
  addItem: (productId: string, quantity: number) => boolean
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearAllItems: () => void
  refreshCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  const refreshCart = () => {
    if (!user) {
      setItems([])
      return
    }
    const cartItems = getCart(user.id)
    // Refresh product data for each cart item
    const updatedItems = cartItems
      .map((item) => {
        const product = getProductById(item.productId)
        return product ? { ...item, product } : item
      })
      .filter((item) => item.product)
    setItems(updatedItems)
  }

  useEffect(() => {
    refreshCart()
  }, [user?.id])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const addItem = (productId: string, quantity: number): boolean => {
    if (!user) return false

    const product = getProductById(productId)
    if (!product) return false

    // Check if quantity is available
    const existingItem = items.find((i) => i.productId === productId)
    const currentQty = existingItem ? existingItem.quantity : 0
    if (currentQty + quantity > product.quantity) {
      return false
    }

    addToCartStore({ productId, quantity, product }, user.id)
    refreshCart()
    return true
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (!user) return
    updateCartItem(productId, quantity, user.id)
    refreshCart()
  }

  const removeItem = (productId: string) => {
    if (!user) return
    removeFromCart(productId, user.id)
    refreshCart()
  }

  const clearAllItems = () => {
    if (!user) return
    clearCart(user.id)
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        addItem,
        updateQuantity,
        removeItem,
        clearAllItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
