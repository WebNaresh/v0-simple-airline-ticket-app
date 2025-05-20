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
    const flights = await db.collection("flights").find({}).toArray()

    return NextResponse.json(flights)
  } catch (error) {
    console.error("Error fetching flights:", error)
    return NextResponse.json({ error: "Failed to fetch flights" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const flightData = await request.json()

    const result = await db.collection("flights").insertOne(flightData)

    return NextResponse.json({ id: result.insertedId, ...flightData }, { status: 201 })
  } catch (error) {
    console.error("Error creating flight:", error)
    return NextResponse.json({ error: "Failed to create flight" }, { status: 500 })
  }
}
