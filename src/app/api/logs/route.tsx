import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all logs
export async function GET() {
  try {
    console.log("Fetching all logs...");

    const logs = await prisma.log.findMany({
      include: {
        user: true,
      },
    });

    if (logs.length === 0) {
      return NextResponse.json({ message: 'No logs found' }, { status: 404 });
    }

    console.log("GET API/logs: logs found:", logs);
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST create a new log
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, metadata, fk_userId } = body;

    if (!action || !fk_userId) {
      return NextResponse.json({ error: 'Missing required fields: action or fk_userId' }, { status: 400 });
    }

    console.log('Creating log with body:', body);

    const newLog = await prisma.log.create({
      data: {
        action,
        metadata,
        fk_userId,
      },
      include: {
        user: true,
      },
    });

    console.log('POST API/logs: log created:', newLog);
    return NextResponse.json(newLog, { status: 201 });
  } catch (error) {
    console.error('Error creating log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
