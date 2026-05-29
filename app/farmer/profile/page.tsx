"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, MapPin, Check } from "lucide-react"

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

export default function FarmerProfilePage() {
  const { user, farmerProfile, updateFarmerProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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
    if (farmerProfile) {
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
  }, [farmerProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!formData.farmSize || Number.parseFloat(formData.farmSize) <= 0) {
      setError("Please enter a valid farm size")
      return
    }

    if (!formData.soilType) {
      setError("Please select your soil type")
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

    setSuccess(true)
    setIsLoading(false)

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Farm Profile</h1>
        <p className="text-muted-foreground">Manage your farm details for better recommendations</p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Phone</Label>
              <p className="font-medium">+91 {user?.phone}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Account Type</Label>
              <p className="font-medium capitalize">{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Farm Details</CardTitle>
          <CardDescription>Update your farm information for AI-powered crop recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-primary/50 bg-primary/5">
                <Check className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">Profile updated successfully!</AlertDescription>
              </Alert>
            )}

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
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
