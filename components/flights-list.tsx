"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Clock, Plane } from "lucide-react"

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

export function FlightsList() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFlights() {
      try {
        const response = await fetch("/api/flights")
        if (response.ok) {
          const data = await response.json()
          setFlights(data)
        } else {
          console.error("Failed to fetch flights")
        }
      } catch (error) {
        console.error("Error fetching flights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // If no flights are available yet, show sample flights
  const sampleFlights: Flight[] =
    flights.length > 0
      ? flights
      : [
          {
            _id: "1",
            flightNumber: "SK101",
            airline: "SkyBooker Airways",
            from: "New York (JFK)",
            to: "Los Angeles (LAX)",
            departureTime: "2023-06-15T08:00:00Z",
            arrivalTime: "2023-06-15T11:30:00Z",
            price: 299,
            seatsAvailable: 45,
          },
          {
            _id: "2",
            flightNumber: "SK205",
            airline: "SkyBooker Airways",
            from: "Chicago (ORD)",
            to: "Miami (MIA)",
            departureTime: "2023-06-16T10:15:00Z",
            arrivalTime: "2023-06-16T13:45:00Z",
            price: 249,
            seatsAvailable: 32,
          },
          {
            _id: "3",
            flightNumber: "SK310",
            airline: "SkyBooker Airways",
            from: "San Francisco (SFO)",
            to: "Seattle (SEA)",
            departureTime: "2023-06-17T14:30:00Z",
            arrivalTime: "2023-06-17T16:45:00Z",
            price: 189,
            seatsAvailable: 18,
          },
        ]

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sampleFlights.map((flight) => (
        <Card key={flight._id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-sky-50 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{flight.airline}</p>
                  <p className="font-semibold">{flight.flightNumber}</p>
                </div>
                <Badge variant="outline" className="bg-white">
                  {flight.seatsAvailable} seats left
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(flight.departureTime)}</p>
                  <p className="text-sm text-muted-foreground">{flight.from}</p>
                </div>
                <div className="flex flex-col items-center justify-center px-4">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(flight.departureTime, flight.arrivalTime)}
                  </div>
                  <div className="relative w-24 my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dashed border-muted-foreground"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Plane className="h-4 w-4 text-muted-foreground rotate-90" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Direct</div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</p>
                  <p className="text-sm text-muted-foreground">{flight.to}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between items-center">
            <div className="font-bold text-xl">${flight.price}</div>
            <Link href={`/flights/${flight._id}`}>
              <Button>
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
