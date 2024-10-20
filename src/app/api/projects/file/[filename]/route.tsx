import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  try {
    // Construct the path to the file inside `src/public/uploads/projects`
    const filePath = path.join(process.cwd(), 'src/public/projects', params.filename);
    
    // Read the file from the filesystem
    const file = await fs.readFile(filePath);

    // Determine the content type based on the file extension
    const ext = path.extname(filePath);
    let contentType = 'application/octet-stream'; // Default binary type
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    }

    // Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
