"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreatePaymentLink from "@/components/create-payment-link"
import WalletConnection from "@/components/wallet-connection"
import { ArrowLeft } from "lucide-react"

export default function CreatePage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()

  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Page header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Create Payment Link
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Generate a shareable link to receive USDC payments
          </p>
        </div>

        {/* Main content */}
        <div className="max-w-2xl mx-auto">
          {!isConnected ? (
            <Card className="rounded-xl shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
                <CardDescription>
                  You need to connect your wallet to create payment links
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WalletConnection
                  isConnected={false}
                  walletAddress=""
                  onConnect={() => {}}
                  isLoading={false}
                />
              </CardContent>
            </Card>
          ) : (
            <CreatePaymentLink 
              onLinkCreated={() => {
                // Optionally redirect to the created link or show success message
                console.log("Payment link created successfully!")
              }} 
            />
          )}
        </div>
      </div>
    </main>
  )
}