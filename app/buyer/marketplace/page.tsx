"use client"

import { useEffect, useState, useMemo } from "react"
import { getProducts } from "@/lib/store"
import { initializeSampleData } from "@/lib/sample-data"
import { formatCurrency } from "@/lib/format"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Search, ShoppingCart, Plus, Minus, Filter, Sprout, User } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

const CATEGORIES = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains & Cereals",
  "Pulses & Lentils",
  "Spices",
  "Dairy Products",
  "Organic Produce",
  "Other",
]

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const { addItem, items, updateQuantity } = useCart()

  useEffect(() => {
    // Initialize sample data if empty
    initializeSampleData()
    setProducts(getProducts())
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.farmerName.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return result
  }, [products, searchQuery, selectedCategory, sortBy])

  const getCartQuantity = (productId: string) => {
    const item = items.find((i) => i.productId === productId)
    return item?.quantity || 0
  }

  const handleAddToCart = (product: Product) => {
    const success = addItem(product.id, 1)
    if (success) {
      toast.success(`Added ${product.name} to cart`)
    } else {
      toast.error("Cannot add more than available quantity")
    }
  }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (product && newQuantity > product.quantity) {
      toast.error("Cannot add more than available quantity")
      return
    }
    updateQuantity(productId, newQuantity)
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Fresh Produce Marketplace</h1>
        <p className="text-muted-foreground">Browse farm-fresh produce from farmers across India</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, farmers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Sprout className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No Products Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const cartQty = getCartQuantity(product.id)
            return (
              <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="aspect-[4/3] bg-muted">
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=300&query=fresh produce"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold leading-tight truncate">{product.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
                      <p className="text-xs text-muted-foreground">per {product.unit}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{product.farmerName}</span>
                    <span className="text-border">|</span>
                    <span>
                      {product.quantity} {product.unit} available
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  {cartQty === 0 ? (
                    <Button className="w-full gap-2" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  ) : (
                    <div className="flex w-full items-center justify-between rounded-md border p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(product.id, cartQty - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">
                        {cartQty} {product.unit}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(product.id, cartQty + 1)}
                        disabled={cartQty >= product.quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
