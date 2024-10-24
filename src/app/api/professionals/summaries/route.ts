// /app/api/professionals/summaries/route.js
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  try {
    // Query to fetch selected fields from professionals table
    const [professionals] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, startTime, endTime, media FROM professionals'
    );

    // Return the list of professional summaries with no caching
    return NextResponse.json(professionals, { status: 200 });
  } catch (error) {
    console.error('Error fetching professional summaries:', error);
    return NextResponse.json({ message: 'Failed to fetch professional summaries' }, { status: 500 });
  }
}
