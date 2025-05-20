import { NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    const flight = await db.collection("flights").findOne({ _id: new ObjectId(id) })

    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 })
    }

    return NextResponse.json(flight)
  } catch (error) {
    console.error("Error fetching flight:", error)
    return NextResponse.json({ error: "Failed to fetch flight" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id
    const flightData = await request.json()

    const result = await db.collection("flights").updateOne({ _id: new ObjectId(id) }, { $set: flightData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 })
    }

    return NextResponse.json({ id, ...flightData })
  } catch (error) {
    console.error("Error updating flight:", error)
    return NextResponse.json({ error: "Failed to update flight" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const id = params.id

    const result = await db.collection("flights").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Flight deleted successfully" })
  } catch (error) {
    console.error("Error deleting flight:", error)
    return NextResponse.json({ error: "Failed to delete flight" }, { status: 500 })
  }
}
