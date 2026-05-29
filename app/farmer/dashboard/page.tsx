"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getProductsByFarmer, getOrdersByFarmer } from "@/lib/store"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Product, Order } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Package, TrendingUp, ShoppingCart, Plus, ArrowRight, Brain } from "lucide-react"
import Link from "next/link"

export default function FarmerDashboardPage() {
  const { user, farmerProfile } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  })

  useEffect(() => {
    if (user) {
      const farmerProducts = getProductsByFarmer(user.id)
      const farmerOrders = getOrdersByFarmer(user.id)
      setProducts(farmerProducts)
      setOrders(farmerOrders)

      // Calculate stats
      const earnings = farmerOrders.reduce((sum, order) => {
        const farmerItems = order.items.filter((item) => item.farmerId === user.id)
        return sum + farmerItems.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
      }, 0)

      setStats({
        totalEarnings: earnings,
        totalProducts: farmerProducts.length,
        totalOrders: farmerOrders.length,
        pendingOrders: farmerOrders.filter((o) => o.status === "pending" || o.status === "confirmed").length,
      })
    }
  }, [user])

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    }
    return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">
            {farmerProfile?.location}, {farmerProfile?.district}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/farmer/smart-grow">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Brain className="h-4 w-4" />
              Smart Grow AI
            </Button>
          </Link>
          <Link href="/farmer/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">From all orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {!farmerProfile && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Add your farm details to unlock personalized crop recommendations with Smart Grow AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/farmer/onboarding">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Products</CardTitle>
              <CardDescription>Your listed produce</CardDescription>
            </div>
            <Link href="/farmer/products">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No products listed yet</p>
                <Link href="/farmer/products/new">
                  <Button variant="outline" className="mt-4 bg-transparent">
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.image || "/placeholder.svg?height=48&width=48&query=vegetables"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} {product.unit} available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.price)}</p>
                      <p className="text-xs text-muted-foreground">per {product.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Orders for your products</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground">
                  Orders will appear here when buyers purchase your products
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{order.buyerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.filter((i) => i.farmerId === user?.id).length} items
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="mt-1 text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
