import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// MongoDB connection
let client: MongoClient
let db: any

async function connectToDatabase() {
  if (!client) {
    // Replace with your MongoDB connection string
    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error("Please add your MongoDB connection string to .env.local")
    }

    client = new MongoClient(uri)
    await client.connect()
    db = client.db("airline-booking")
  }
  return { client, db }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const bookings = await db.collection("bookings").find({}).toArray()

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const bookingData = await request.json()

    const result = await db.collection("bookings").insertOne(bookingData)

    return NextResponse.json({ id: result.insertedId, ...bookingData }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
