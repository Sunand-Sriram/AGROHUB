"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, FarmerProfile } from "@/lib/types"
import {
  getCurrentUser,
  setCurrentUser,
  getUserByEmail,
  addUser,
  getFarmerProfile,
  saveFarmerProfile,
  generateId,
} from "@/lib/store"

interface AuthContextType {
  user: User | null
  farmerProfile: FarmerProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateFarmerProfile: (profile: Partial<FarmerProfile>) => void
}

interface SignupData {
  email: string
  password: string
  name: string
  phone: string
  role: "farmer" | "buyer"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getCurrentUser()
    if (storedUser) {
      setUser(storedUser)
      if (storedUser.role === "farmer") {
        const profile = getFarmerProfile(storedUser.id)
        setFarmerProfile(profile || null)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const existingUser = getUserByEmail(email)
    if (!existingUser) {
      return { success: false, error: "User not found" }
    }
    if (existingUser.password !== password) {
      return { success: false, error: "Invalid password" }
    }
    setUser(existingUser)
    setCurrentUser(existingUser)
    if (existingUser.role === "farmer") {
      const profile = getFarmerProfile(existingUser.id)
      setFarmerProfile(profile || null)
    }
    return { success: true }
  }

  const signup = async (data: SignupData) => {
    const existingUser = getUserByEmail(data.email)
    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }
    const newUser: User = {
      id: generateId(),
      email: data.email,
      password: data.password,
      name: data.name,
      phone: data.phone,
      role: data.role,
      createdAt: new Date().toISOString(),
    }
    addUser(newUser)
    setUser(newUser)
    setCurrentUser(newUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    setFarmerProfile(null)
    setCurrentUser(null)
  }

  const updateFarmerProfile = (profile: Partial<FarmerProfile>) => {
    if (!user || user.role !== "farmer") return
    const newProfile: FarmerProfile = {
      userId: user.id,
      farmSize: profile.farmSize || farmerProfile?.farmSize || 0,
      farmSizeUnit: profile.farmSizeUnit || farmerProfile?.farmSizeUnit || "acres",
      soilType: profile.soilType || farmerProfile?.soilType || "loamy",
      location: profile.location || farmerProfile?.location || "",
      state: profile.state || farmerProfile?.state || "",
      district: profile.district || farmerProfile?.district || "",
      pincode: profile.pincode || farmerProfile?.pincode || "",
      coordinates: profile.coordinates || farmerProfile?.coordinates,
    }
    saveFarmerProfile(newProfile)
    setFarmerProfile(newProfile)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        isLoading,
        login,
        signup,
        logout,
        updateFarmerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
