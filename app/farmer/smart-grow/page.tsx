"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getCropRecommendations } from "@/lib/crop-recommendation"
import type { CropRecommendation, EnvironmentalData } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Brain,
  Loader2,
  Sprout,
  TrendingUp,
  Droplets,
  Thermometer,
  Wind,
  FlaskConical,
  IndianRupee,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function SmartGrowPage() {
  const { user, farmerProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null)
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null)

  const handleGetRecommendations = async () => {
    if (!farmerProfile) return

    setIsLoading(true)

    // Simulate API delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = getCropRecommendations(farmerProfile)
    setRecommendations(result.recommendations)
    setEnvData(result.environmentalData)

    setIsLoading(false)
  }

  const getDemandBadge = (demand: "high" | "medium" | "low") => {
    const variants: Record<"high" | "medium" | "low", "default" | "secondary" | "outline"> = {
      high: "default",
      medium: "secondary",
      low: "outline",
    }
    return <Badge variant={variants[demand]}>{demand.charAt(0).toUpperCase() + demand.slice(1)} Demand</Badge>
  }

  if (!farmerProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Smart Grow AI</h1>
          <p className="text-muted-foreground">Get AI-powered crop recommendations</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Complete Your Profile</AlertTitle>
          <AlertDescription>
            To get personalized crop recommendations, please complete your farm profile with soil type and location
            details.
          </AlertDescription>
        </Alert>

        <Link href="/farmer/onboarding">
          <Button>Complete Farm Profile</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Smart Grow AI</h1>
          <p className="text-muted-foreground">AI-powered crop recommendations for your farm</p>
        </div>
        <Button onClick={handleGetRecommendations} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : recommendations ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh Recommendations
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Get Crop Recommendations
            </>
          )}
        </Button>
      </div>

      {/* Farm Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Farm Profile</CardTitle>
          <CardDescription>Data used for AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">
                {farmerProfile.district}, {farmerProfile.state}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Farm Size</p>
              <p className="font-medium">
                {farmerProfile.farmSize} {farmerProfile.farmSizeUnit}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Soil Type</p>
              <p className="font-medium capitalize">{farmerProfile.soilType}</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Pincode</p>
              <p className="font-medium">{farmerProfile.pincode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="border-primary/50">
          <CardContent className="py-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-8 w-8 animate-pulse text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Analyzing Your Farm Data</h3>
            <p className="text-muted-foreground">
              Our AI is analyzing soil conditions, weather patterns, and market trends...
            </p>
            <Progress className="mx-auto mt-4 h-2 w-64" value={66} />
          </CardContent>
        </Card>
      )}

      {/* Environmental Data */}
      {envData && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environmental Analysis</CardTitle>
            <CardDescription>Current conditions in {farmerProfile.district}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-lg font-semibold">{envData.temperature}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Wind className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-lg font-semibold">{envData.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Droplets className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rainfall</p>
                  <p className="text-lg font-semibold">{envData.rainfall} mm</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <FlaskConical className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Soil pH</p>
                  <p className="text-lg font-semibold">{envData.ph}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">Nitrogen (N)</p>
                <p className="text-lg font-semibold">{envData.nitrogen} kg/ha</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">Phosphorus (P)</p>
                <p className="text-lg font-semibold">{envData.phosphorus} kg/ha</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm text-muted-foreground">Potassium (K)</p>
                <p className="text-lg font-semibold">{envData.potassium} kg/ha</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations && !isLoading && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Top 3 Recommended Crops</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {recommendations.map((rec, index) => (
              <Card key={rec.cropName} className={index === 0 ? "border-primary/50 bg-primary/5 lg:scale-[1.02]" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <Sprout className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rec.cropName}</CardTitle>
                        {index === 0 && <Badge className="mt-1">Best Match</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{rec.suitabilityScore}%</div>
                      <p className="text-xs text-muted-foreground">Suitability</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={rec.suitabilityScore} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Market Demand</span>
                    {getDemandBadge(rec.marketDemand)}
                  </div>

                  <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Expected Yield:</span>
                      <span className="font-medium">{rec.expectedYield}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Est. Revenue:</span>
                      <span className="font-medium">{rec.estimatedRevenue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Season:</span>
                      <span className="font-medium">{rec.growingSeason}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!recommendations && !isLoading && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Ready to Analyze</h3>
            <p className="mx-auto mb-6 max-w-md text-muted-foreground">
              Click &quot;Get Crop Recommendations&quot; to analyze your soil type, local weather conditions, and market
              trends to find the best crops for your farm.
            </p>
            <Button onClick={handleGetRecommendations} className="gap-2">
              <Brain className="h-4 w-4" />
              Get Crop Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
