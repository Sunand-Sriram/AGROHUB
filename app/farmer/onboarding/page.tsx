"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sprout, Loader2, MapPin } from "lucide-react"
import Link from "next/link"

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const SOIL_TYPES = [
  { value: "loamy", label: "Loamy (Best for most crops)" },
  { value: "clay", label: "Clay (Heavy, water-retentive)" },
  { value: "sandy", label: "Sandy (Light, fast-draining)" },
  { value: "silty", label: "Silty (Fertile, smooth)" },
  { value: "peaty", label: "Peaty (Acidic, organic-rich)" },
  { value: "chalky", label: "Chalky (Alkaline, stony)" },
]

export default function FarmerOnboardingPage() {
  const router = useRouter()
  const { user, farmerProfile, updateFarmerProfile, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    farmSize: "",
    farmSizeUnit: "acres" as "acres" | "hectares",
    soilType: "" as "loamy" | "clay" | "sandy" | "silty" | "peaty" | "chalky" | "",
    location: "",
    state: "",
    district: "",
    pincode: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (!authLoading && user?.role !== "farmer") {
      router.push("/buyer/marketplace")
    } else if (farmerProfile) {
      // Pre-fill if profile exists
      setFormData({
        farmSize: farmerProfile.farmSize.toString(),
        farmSizeUnit: farmerProfile.farmSizeUnit,
        soilType: farmerProfile.soilType,
        location: farmerProfile.location,
        state: farmerProfile.state,
        district: farmerProfile.district,
        pincode: farmerProfile.pincode,
      })
    }
  }, [user, farmerProfile, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.farmSize || Number.parseFloat(formData.farmSize) <= 0) {
      setError("Please enter a valid farm size")
      return
    }

    if (!formData.soilType) {
      setError("Please select your soil type")
      return
    }

    if (!formData.state) {
      setError("Please select your state")
      return
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Please enter a valid 6-digit pincode")
      return
    }

    setIsLoading(true)

    updateFarmerProfile({
      farmSize: Number.parseFloat(formData.farmSize),
      farmSizeUnit: formData.farmSizeUnit,
      soilType: formData.soilType as "loamy" | "clay" | "sandy" | "silty" | "peaty" | "chalky",
      location: formData.location,
      state: formData.state,
      district: formData.district,
      pincode: formData.pincode,
    })

    router.push("/farmer/dashboard")
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sprout className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">AgroHub</span>
          </Link>
          <CardTitle className="text-2xl">Complete Your Farm Profile</CardTitle>
          <CardDescription>Help us understand your farm better to provide personalized recommendations</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Farm Size */}
            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size</Label>
              <div className="flex gap-2">
                <Input
                  id="farmSize"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter farm size"
                  className="flex-1"
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                  required
                />
                <Select
                  value={formData.farmSizeUnit}
                  onValueChange={(value: "acres" | "hectares") => setFormData({ ...formData, farmSizeUnit: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="hectares">Hectares</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Soil Type */}
            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select
                value={formData.soilType}
                onValueChange={(value) => setFormData({ ...formData, soilType: value as typeof formData.soilType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your soil type" />
                </SelectTrigger>
                <SelectContent>
                  {SOIL_TYPES.map((soil) => (
                    <SelectItem key={soil.value} value={soil.value}>
                      {soil.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Farm Location
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    type="text"
                    placeholder="Enter district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Village/Town</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter village or town"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
