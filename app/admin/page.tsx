"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"

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

export default function AdminPage() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [flightToEdit, setFlightToEdit] = useState<Flight | null>(null)
  const [flightToDelete, setFlightToDelete] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    seatsAvailable: "",
  })

  useEffect(() => {
    fetchFlights()
  }, [])

  useEffect(() => {
    if (flightToEdit) {
      setFormData({
        flightNumber: flightToEdit.flightNumber,
        airline: flightToEdit.airline,
        from: flightToEdit.from,
        to: flightToEdit.to,
        departureTime: new Date(flightToEdit.departureTime).toISOString().slice(0, 16),
        arrivalTime: new Date(flightToEdit.arrivalTime).toISOString().slice(0, 16),
        price: flightToEdit.price.toString(),
        seatsAvailable: flightToEdit.seatsAvailable.toString(),
      })
    }
  }, [flightToEdit])

  async function fetchFlights() {
    setLoading(true)
    try {
      const response = await fetch("/api/flights")
      if (response.ok) {
        const data = await response.json()
        setFlights(data)
      } else {
        console.error("Failed to fetch flights")
        // For demo purposes, set sample data if API fails
        setFlights(sampleFlights)
      }
    } catch (error) {
      console.error("Error fetching flights:", error)
      // For demo purposes, set sample data if API fails
      setFlights(sampleFlights)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddFlight = async (e: React.FormEvent) => {
    e.preventDefault()

    const newFlight = {
      flightNumber: formData.flightNumber,
      airline: formData.airline,
      from: formData.from,
      to: formData.to,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      price: Number.parseFloat(formData.price),
      seatsAvailable: Number.parseInt(formData.seatsAvailable),
    }

    try {
      const response = await fetch("/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFlight),
      })

      if (response.ok) {
        fetchFlights()
        resetForm()
        setIsAddDialogOpen(false)
      } else {
        console.error("Failed to add flight")
      }
    } catch (error) {
      console.error("Error adding flight:", error)
    }
  }

  const handleEditFlight = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!flightToEdit) return

    const updatedFlight = {
      flightNumber: formData.flightNumber,
      airline: formData.airline,
      from: formData.from,
      to: formData.to,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      price: Number.parseFloat(formData.price),
      seatsAvailable: Number.parseInt(formData.seatsAvailable),
    }

    try {
      const response = await fetch(`/api/flights/${flightToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFlight),
      })

      if (response.ok) {
        fetchFlights()
        resetForm()
        setIsEditDialogOpen(false)
        setFlightToEdit(null)
      } else {
        console.error("Failed to update flight")
      }
    } catch (error) {
      console.error("Error updating flight:", error)
    }
  }

  const handleDeleteFlight = async () => {
    if (!flightToDelete) return

    try {
      const response = await fetch(`/api/flights/${flightToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchFlights()
        setFlightToDelete(null)
      } else {
        console.error("Failed to delete flight")
      }
    } catch (error) {
      console.error("Error deleting flight:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      flightNumber: "",
      airline: "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      seatsAvailable: "",
    })
  }

  // Sample flights for demo purposes
  const sampleFlights: Flight[] = [
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Admin Dashboard</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Flights Management</CardTitle>
              <CardDescription>Add, edit, or remove flights from the system.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Flight
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Flight</DialogTitle>
                  <DialogDescription>Fill in the details to add a new flight to the system.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddFlight}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="flightNumber">Flight Number</Label>
                        <Input
                          id="flightNumber"
                          name="flightNumber"
                          value={formData.flightNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="airline">Airline</Label>
                        <Input
                          id="airline"
                          name="airline"
                          value={formData.airline}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from">From</Label>
                        <Input id="from" name="from" value={formData.from} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to">To</Label>
                        <Input id="to" name="to" value={formData.to} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="departureTime">Departure Time</Label>
                        <Input
                          id="departureTime"
                          name="departureTime"
                          type="datetime-local"
                          value={formData.departureTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arrivalTime">Arrival Time</Label>
                        <Input
                          id="arrivalTime"
                          name="arrivalTime"
                          type="datetime-local"
                          value={formData.arrivalTime}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seatsAvailable">Available Seats</Label>
                        <Input
                          id="seatsAvailable"
                          name="seatsAvailable"
                          type="number"
                          min="0"
                          value={formData.seatsAvailable}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Flight</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flight #</TableHead>
                <TableHead>Airline</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight._id}>
                  <TableCell className="font-medium">{flight.flightNumber}</TableCell>
                  <TableCell>{flight.airline}</TableCell>
                  <TableCell>
                    {flight.from} → {flight.to}
                  </TableCell>
                  <TableCell>
                    {new Date(flight.departureTime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>${flight.price}</TableCell>
                  <TableCell>{flight.seatsAvailable}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && flightToEdit?._id === flight._id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open)
                          if (!open) setFlightToEdit(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setFlightToEdit(flight)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Flight</DialogTitle>
                            <DialogDescription>Update the flight details.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditFlight}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-flightNumber">Flight Number</Label>
                                  <Input
                                    id="edit-flightNumber"
                                    name="flightNumber"
                                    value={formData.flightNumber}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-airline">Airline</Label>
                                  <Input
                                    id="edit-airline"
                                    name="airline"
                                    value={formData.airline}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-from">From</Label>
                                  <Input
                                    id="edit-from"
                                    name="from"
                                    value={formData.from}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-to">To</Label>
                                  <Input
                                    id="edit-to"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-departureTime">Departure Time</Label>
                                  <Input
                                    id="edit-departureTime"
                                    name="departureTime"
                                    type="datetime-local"
                                    value={formData.departureTime}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-arrivalTime">Arrival Time</Label>
                                  <Input
                                    id="edit-arrivalTime"
                                    name="arrivalTime"
                                    type="datetime-local"
                                    value={formData.arrivalTime}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-price">Price ($)</Label>
                                  <Input
                                    id="edit-price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-seatsAvailable">Available Seats</Label>
                                  <Input
                                    id="edit-seatsAvailable"
                                    name="seatsAvailable"
                                    type="number"
                                    min="0"
                                    value={formData.seatsAvailable}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => setFlightToDelete(flight._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the flight {flight.flightNumber} from {flight.from} to{" "}
                              {flight.to}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setFlightToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteFlight} className="bg-red-500 hover:bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
