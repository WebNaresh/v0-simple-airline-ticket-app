"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, CreditCard, Plane } from "lucide-react"

interface Flight {
  _id: string
  flightNumber: string
  airline: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  price: number
  seatsAvailable: number
}

interface BookingFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  passengers: number
}

export default function FlightDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [flight, setFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passengers: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchFlight() {
      try {
        const response = await fetch(`/api/flights/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setFlight(data)
        } else {
          console.error("Failed to fetch flight")
          // For demo purposes, set sample data if API fails
          setFlight(sampleFlight)
        }
      } catch (error) {
        console.error("Error fetching flight:", error)
        // For demo purposes, set sample data if API fails
        setFlight(sampleFlight)
      } finally {
        setLoading(false)
      }
    }

    fetchFlight()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, we would submit the booking to an API
      // For demo purposes, we'll just simulate a delay and redirect
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to a confirmation page
      router.push(`/bookings/confirmation?flightId=${params.id}`)
    } catch (error) {
      console.error("Error submitting booking:", error)
      setIsSubmitting(false)
    }
  }

  // Sample flight for demo purposes
  const sampleFlight: Flight = {
    _id: params.id,
    flightNumber: "SK101",
    airline: "SkyBooker Airways",
    from: "New York (JFK)",
    to: "Los Angeles (LAX)",
    departureTime: "2023-06-15T08:00:00Z",
    arrivalTime: "2023-06-15T11:30:00Z",
    price: 299,
    seatsAvailable: 45,
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function formatTime(dateString: string) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  function formatDuration(departure: string, arrival: string) {
    const departureTime = new Date(departure)
    const arrivalTime = new Date(arrival)
    const durationMs = arrivalTime.getTime() - departureTime.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Flights
            </Button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
        </div>
      </div>
    )
  }

  if (!flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Flights
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Flight Not Found</h2>
          <p className="text-muted-foreground mb-6">The flight you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Flights
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Flight Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{flight.airline}</p>
                    <p className="font-semibold">{flight.flightNumber}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{formatDate(flight.departureTime)}</div>
                </div>

                <div className="flex justify-between mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{formatTime(flight.departureTime)}</p>
                    <p className="text-lg">{flight.from}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center px-4">
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration(flight.departureTime, flight.arrivalTime)}
                    </div>
                    <div className="relative w-32 my-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dashed border-muted-foreground"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Plane className="h-4 w-4 text-muted-foreground rotate-90" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Direct Flight</div>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold">{formatTime(flight.arrivalTime)}</p>
                    <p className="text-lg">{flight.to}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Flight</p>
                    <p className="font-medium">{flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Aircraft</p>
                    <p className="font-medium">Boeing 737</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-medium">Economy</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-4">Fare Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base fare</span>
                      <span>${flight.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & fees</span>
                      <span>${Math.round(flight.price * 0.12)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total per passenger</span>
                      <span>${Math.round(flight.price * 1.12)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Passenger Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passengers">Number of Passengers</Label>
                  <Input
                    id="passengers"
                    name="passengers"
                    type="number"
                    min="1"
                    max={flight.seatsAvailable}
                    value={formData.passengers}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{flight.seatsAvailable} seats available</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Price:</span>
                    <span>${Math.round(flight.price * 1.12 * formData.passengers)}</span>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
