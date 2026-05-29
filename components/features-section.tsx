import { Brain, Truck, Shield, Smartphone, BarChart3, Headphones } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Crop Recommendations",
    description:
      "Our Smart Grow feature analyzes soil type, weather data, and market trends to suggest the best crops for your farm.",
  },
  {
    icon: Truck,
    title: "Direct Farm-to-Table",
    description: "Eliminate middlemen and get produce delivered directly from farms to your doorstep across India.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Safe payment options including UPI, Net Banking, and Cash on Delivery with full transaction protection.",
  },
  {
    icon: Smartphone,
    title: "Easy to Use",
    description: "Simple, intuitive interface designed for farmers and buyers of all tech skill levels.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Farmers get detailed insights on sales, inventory, and performance to grow their business.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer support in Hindi and English to assist with any queries or issues.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Why Choose AgroHub?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We are building the future of agricultural commerce in India with technology and trust.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
