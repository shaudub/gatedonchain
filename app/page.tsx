"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const samplePaymentLinks = [
  {
    id: 1,
    title: "Optimism Grant",
    recipientAddress: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    amount: "2,500.00"
  },
  {
    id: 2,
    title: "Freelance Design Work",
    recipientAddress: "0xa529Fca8E3Ea197Da67FcCe0eE5a1Ba5e3c60284",
    amount: "750.00"
  },
  {
    id: 3,
    title: "Open Source Contribution",
    recipientAddress: "0x742d35Cc6634C0532925a3b8D5E43A4a4b9B5c1e",
    amount: "100.00"
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
            <Card key={link.id} className="rounded-xl shadow-lg hover:shadow-xl transition-shadow">
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
                <div className="pt-2">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${link.amount} USDC
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
