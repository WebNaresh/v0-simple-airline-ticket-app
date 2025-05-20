"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Download, Home, Plane } from "lucide-react"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const flightId = searchParams.get("flightId")
  const [bookingNumber, setBookingNumber] = useState("")

  useEffect(() => {
    // Generate a random booking number
    const randomBooking =
      "SB" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    setBookingNumber(randomBooking)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-100 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            <CardDescription>Your flight has been successfully booked.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Reference</p>
                  <p className="font-bold text-lg">{bookingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Flight</p>
                  <p className="font-medium">SK101</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">New York (JFK)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="font-medium">Los Angeles (LAX)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">June 15, 2023</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-green-600">Confirmed</p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p>A confirmation email has been sent to your email address.</p>
              <p className="text-sm text-muted-foreground">
                Please arrive at the airport at least 2 hours before your scheduled departure.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download E-Ticket
            </Button>
            <div className="flex gap-4 w-full">
              <Link href="/bookings" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Plane className="mr-2 h-4 w-4" />
                  My Bookings
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
