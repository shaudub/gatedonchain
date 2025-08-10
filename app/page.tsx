"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const samplePaymentLinks = [
  {
    id: 1,
    title: "Coffee Fund ☕",
    recipientAddress: "0x390b5956FA3606841598FE887b704407D26e4805",
    amount: "5.00",
    slug: "/project/coffee-fund"
  },
  {
    id: 2,
    title: "Bitcoin Whitepaper Download 📄",
    recipientAddress: "0x390b5956FA3606841598FE887b704407D26e4805",
    amount: "0.05",
    slug: "/project/bitcoin-whitepaper"
  },
  {
    id: 3,
    title: "Open Source Contribution 🚀",
    recipientAddress: "0x390b5956FA3606841598FE887b704407D26e4805",
    amount: "25.00",
    slug: "/project/open-source-contribution"
  }
]

export default function Home() {
  const router = useRouter()

  const handleCreatePaymentLink = () => {
    router.push("/create")
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Full-width button at the top */}
        <div className="mb-16">
          <Button 
            onClick={handleCreatePaymentLink}
            className="w-full h-16 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            Make payment link here
          </Button>
        </div>

        {/* Sample Links Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Sample Links
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {samplePaymentLinks.map((link) => (
              <Card key={link.id} className="rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      {link.title.replace(' ☕', '').replace(' 📄', '').replace(' 🚀', '')}
                      <a 
                        href={link.slug} 
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        🔗
                      </a>
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {link.id === 1 && "Support my coding with a coffee donation"}
                    {link.id === 2 && "Download the original Bitcoin whitepaper"}
                    {link.id === 3 && "Fund open source blockchain development"}
                  </p>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 break-all">
                    {link.recipientAddress}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
