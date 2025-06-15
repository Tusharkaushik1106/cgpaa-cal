import { NextResponse } from 'next/server';
import connectDB from '~/app/lib/mongodb';
import User from '~/app/models/User';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    await connectDB();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    user.actualCGPA = null;
    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing CGPA:', error);
    return NextResponse.json({ error: 'Failed to clear CGPA' }, { status: 500 });
  }
} 