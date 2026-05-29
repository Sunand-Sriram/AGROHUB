import Link from "next/link"
import { Sprout } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AgroHub</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting Indian farmers directly with consumers for fresh, sustainable produce.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">For Farmers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/signup?role=farmer" className="hover:text-foreground">
                  Start Selling
                </Link>
              </li>
              <li>
                <Link href="/farmer/smart-grow" className="hover:text-foreground">
                  Smart Grow AI
                </Link>
              </li>
              <li>
                <Link href="/farmer/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">For Buyers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/signup?role=buyer" className="hover:text-foreground">
                  Start Shopping
                </Link>
              </li>
              <li>
                <Link href="/buyer/marketplace" className="hover:text-foreground">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/buyer/orders" className="hover:text-foreground">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@agrohub.in</li>
              <li>+91 1800-XXX-XXXX</li>
              <li>Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AgroHub. All rights reserved. Made in India.</p>
        </div>
      </div>
    </footer>
  )
}
