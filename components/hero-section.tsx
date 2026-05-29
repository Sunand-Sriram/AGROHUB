"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sprout, ShoppingBag, ArrowRight, Leaf, TrendingUp, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Leaf className="h-4 w-4" />
            Connecting Farms to Families Across India
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Fresh Produce, Direct from
            <span className="text-primary"> Indian Farms</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            AgroHub bridges the gap between hardworking farmers and conscious consumers. Get fresh, locally-grown
            produce while supporting sustainable agriculture.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:gap-12">
          {/* Farmer Card */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/10 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sprout className="h-7 w-7" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">I am a Farmer</h2>
              <p className="mb-6 text-muted-foreground">
                List your produce, get AI-powered crop recommendations, and reach buyers directly without middlemen.
              </p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Smart Grow AI recommendations
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  Direct access to buyers
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Leaf className="h-4 w-4 text-primary" />
                  Better prices for your produce
                </li>
              </ul>
              <Link href="/signup?role=farmer">
                <Button className="group/btn w-full gap-2">
                  Start Selling
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-all hover:shadow-lg">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-secondary/50 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-foreground">I am a Buyer</h2>
              <p className="mb-6 text-muted-foreground">
                Browse fresh produce from local farmers, support sustainable agriculture, and enjoy farm-fresh quality.
              </p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Leaf className="h-4 w-4 text-secondary-foreground" />
                  Farm-fresh produce daily
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 text-secondary-foreground" />
                  Support local farmers
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-secondary-foreground" />
                  Competitive fair prices
                </li>
              </ul>
              <Link href="/signup?role=buyer">
                <Button variant="secondary" className="group/btn w-full gap-2">
                  Start Shopping
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">5,000+</div>
            <div className="mt-1 text-sm text-muted-foreground">Farmers Registered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">50,000+</div>
            <div className="mt-1 text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">200+</div>
            <div className="mt-1 text-sm text-muted-foreground">Indian Districts</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">1Cr+</div>
            <div className="mt-1 text-sm text-muted-foreground">Produce Sold (kg)</div>
          </div>
        </div>
      </div>
    </section>
  )
}
