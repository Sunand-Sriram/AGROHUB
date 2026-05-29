"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { FarmerSidebar } from "@/components/farmer/farmer-sidebar"
import { Loader2 } from "lucide-react"

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user?.role !== "farmer") {
      router.push("/buyer/marketplace")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.role !== "farmer") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <FarmerSidebar />
      <main className="md:ml-64">
        <div className="p-4 pt-20 md:p-8 md:pt-8">{children}</div>
      </main>
    </div>
  )
}
