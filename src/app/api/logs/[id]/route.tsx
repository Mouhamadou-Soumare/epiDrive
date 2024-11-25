import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET a specific log by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const logId = parseInt(id);
  if (isNaN(logId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    console.log("Fetching log with ID:", logId);

    const log = await prisma.log.findUnique({
      where: { id: logId },
      include: {
        user: true,
      },
    });

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    console.log('GET API/logs/' + id + ': log found:', log);
    return NextResponse.json(log, { status: 200 });
  } catch (error) {
    console.error('Error fetching log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a specific log by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const logId = parseInt(id);
  if (isNaN(logId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    console.log("Deleting log with ID:", logId);

    const log = await prisma.log.findUnique({
      where: { id: logId },
    });

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    await prisma.log.delete({
      where: { id: logId },
    });

    console.log('DELETE API/logs/' + id + ': log deleted');
    return NextResponse.json({ message: 'Log deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
