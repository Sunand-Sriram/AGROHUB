"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { addOrder, generateId, updateProduct, getProductById } from "@/lib/store"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Truck, ArrowLeft, CheckCircle2, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, totalAmount, clearAllItems } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod" as "cod" | "online",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError("Please fill in all address fields")
      return
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Please enter a valid 6-digit pincode")
      return
    }

    setIsLoading(true)

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newOrderId = generateId()
    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`

    // Create order
    addOrder({
      id: newOrderId,
      buyerId: user!.id,
      buyerName: formData.name,
      buyerPhone: formData.phone,
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        farmerId: item.product.farmerId,
        farmerName: item.product.farmerName,
      })),
      totalAmount,
      status: "pending",
      paymentMethod: formData.paymentMethod,
      shippingAddress,
      createdAt: new Date().toISOString(),
    })

    // Update product quantities
    items.forEach((item) => {
      const product = getProductById(item.productId)
      if (product) {
        updateProduct({
          ...product,
          quantity: product.quantity - item.quantity,
          updatedAt: new Date().toISOString(),
        })
      }
    })

    // Clear cart
    clearAllItems()

    setOrderId(newOrderId)
    setOrderPlaced(true)
    setIsLoading(false)
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
        <Card>
          <CardContent className="py-16 text-center">
            <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Your Cart is Empty</h3>
            <p className="mb-6 text-muted-foreground">Add items to your cart before checkout</p>
            <Link href="/buyer/marketplace">
              <Button>Browse Marketplace</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Card className="border-primary/50">
          <CardContent className="py-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Order Placed Successfully!</h2>
            <p className="mb-4 text-muted-foreground">Thank you for your order. Your fresh produce is on its way!</p>
            <div className="mb-6 rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-lg font-semibold">{orderId}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/buyer/orders">
                <Button className="w-full sm:w-auto">View Order History</Button>
              </Link>
              <Link href="/buyer/marketplace">
                <Button variant="outline" className="w-full bg-transparent sm:w-auto">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/buyer/cart">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Shipping & Payment */}
          <div className="space-y-6 lg:col-span-2">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
                <CardDescription>Where should we deliver your order?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex">
                      <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        className="rounded-l-none"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Textarea
                    id="address"
                    placeholder="House/Flat No., Building Name, Street, Landmark"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="6-digit pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Select how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value: "cod" | "online") => setFormData({ ...formData, paymentMethod: value })}
                  className="space-y-3"
                >
                  <div
                    className={`flex items-center space-x-3 rounded-lg border p-4 ${formData.paymentMethod === "cod" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery (COD)</div>
                      <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-3 rounded-lg border p-4 ${formData.paymentMethod === "online" ? "border-primary bg-primary/5" : ""}`}
                  >
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="font-medium">Online Payment</div>
                      <div className="text-sm text-muted-foreground">UPI, Net Banking, Cards (Simulated)</div>
                    </Label>
                  </div>
                </RadioGroup>

                {formData.paymentMethod === "online" && (
                  <div className="mt-4 rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                      This is a demo application. Online payment will be simulated and no actual charges will be made.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.product.image || "/placeholder.svg?height=48&width=48&query=produce"}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} {item.product.unit} x {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-primary">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Place Order - {formatCurrency(totalAmount)}</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
