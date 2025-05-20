"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ArrowRight, Plane } from "lucide-react"

interface Booking {
  id: string
  bookingReference: string
  flightNumber: string
  from: string
  to: string
  departureDate: string
  status: "confirmed" | "cancelled" | "completed"
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, we would fetch bookings from an API
    // For demo purposes, we'll just simulate a delay and set sample data
    const timer = setTimeout(() => {
      setBookings(sampleBookings)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Sample bookings for demo purposes
  const sampleBookings: Booking[] = [
    {
      id: "1",
      bookingReference: "SB123456",
      flightNumber: "SK101",
      from: "New York (JFK)",
      to: "Los Angeles (LAX)",
      departureDate: "2023-06-15T08:00:00Z",
      status: "confirmed",
    },
    {
      id: "2",
      bookingReference: "SB789012",
      flightNumber: "SK205",
      from: "Chicago (ORD)",
      to: "Miami (MIA)",
      departureDate: "2023-06-16T10:15:00Z",
      status: "confirmed",
    },
    {
      id: "3",
      bookingReference: "SB345678",
      flightNumber: "SK310",
      from: "San Francisco (SFO)",
      to: "Seattle (SEA)",
      departureDate: "2023-05-17T14:30:00Z",
      status: "completed",
    },
  ]

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "confirmed":
        return "text-green-600"
      case "cancelled":
        return "text-red-600"
      case "completed":
        return "text-blue-600"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">My Bookings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Flight Bookings</CardTitle>
          <CardDescription>View and manage your flight bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            </div>
          ) : bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Flight</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.bookingReference}</TableCell>
                    <TableCell>{booking.flightNumber}</TableCell>
                    <TableCell>
                      {booking.from} → {booking.to}
                    </TableCell>
                    <TableCell>{formatDate(booking.departureDate)}</TableCell>
                    <TableCell className={getStatusColor(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/bookings/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Plane className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground mb-6">You haven't made any bookings yet.</p>
              <Link href="/">
                <Button>Book a Flight</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
