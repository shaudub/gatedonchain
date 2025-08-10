"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const samplePaymentLinks = [
  {
    id: 1,
    title: "Coffee Fund ☕",
    recipientAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    amount: "5.00",
    slug: "/project/coffee-fund"
  },
  {
    id: 2,
    title: "Bitcoin Whitepaper Download 📄",
    recipientAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    amount: "0.05",
    slug: "/project/bitcoin-whitepaper"
  },
  {
    id: 3,
    title: "Open Source Contribution 🚀",
    recipientAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
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

        {/* Sample payment link cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {samplePaymentLinks.map((link) => (
            <Card key={link.id} className="rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  {link.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Recipient Address
                  </p>
                  <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                    {link.recipientAddress}
                  </p>
                </div>
                <div className="pt-2 mb-4">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${link.amount} USDC
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => router.push(link.slug)}
                >
                  View Payment Link
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
