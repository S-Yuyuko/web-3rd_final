import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET: Fetch project summaries (id, title, startTime, endTime, media)
export async function GET(req: NextRequest) {
  try {
    // Query to fetch selected fields from the projects table
    const [projects] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, startTime, endTime, media FROM projects'
    );

    // Ensure a successful response with fresh data by setting cache headers to no-store
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching project summaries:', error);
    
    // Return error response with appropriate status and message
    return NextResponse.json({ message: 'Failed to fetch project summaries' }, { status: 500 });
  }
}
