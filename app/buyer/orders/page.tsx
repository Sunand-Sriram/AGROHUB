"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getOrdersByBuyer } from "@/lib/store"
import { formatCurrency, formatDateTime } from "@/lib/format"
import type { Order } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Package, ShoppingBag, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (user) {
      const buyerOrders = getOrdersByBuyer(user.id)
      // Sort by newest first
      buyerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setOrders(buyerOrders)
    }
  }, [user])

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    const variants: Record<Order["status"], "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
    }
    const labels: Record<Order["status"], string> = {
      pending: "Pending",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    }
    return (
      <Badge variant={variants[status]} className="gap-1">
        {getStatusIcon(status)}
        {labels[status]}
      </Badge>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
          <p className="text-muted-foreground">View your order history</p>
        </div>
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No Orders Yet</h3>
            <p className="mb-6 text-muted-foreground">Your order history will appear here after your first purchase</p>
            <Link href="/buyer/marketplace">
              <Button className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">My Orders</h1>
        <p className="text-muted-foreground">{orders.length} orders placed</p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {orders.map((order) => (
          <AccordionItem key={order.id} value={order.id} className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline [&[data-state=open]]:rounded-b-none">
              <div className="flex flex-1 flex-col items-start gap-2 text-left sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-4">
                {/* Order Items */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">Order Items ({order.items.length})</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">by {item.farmerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Shipping & Payment Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Shipping Address
                    </div>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      Payment Method
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-lg font-bold">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
