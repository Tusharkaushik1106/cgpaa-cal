import { NextResponse } from 'next/server';
import connectDB from '~/app/lib/mongodb';
import User from '~/app/models/User';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (username !== 'tushar' || password !== 'admin23') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    await User.updateMany({}, { $set: { actualCGPA: null } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing all CGPA:', error);
    return NextResponse.json({ error: 'Failed to clear all CGPA' }, { status: 500 });
  }
} 