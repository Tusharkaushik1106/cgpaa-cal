import { NextResponse } from 'next/server';
import connectDB from '~/app/lib/mongodb';
import User from '~/app/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ actualCGPA: -1 });

    const leaderboard = users.map(user => ({
      username: user.username,
      guessedCGPA: user.guessedCGPA,
      actualCGPA: user.actualCGPA,
      difference: user.actualCGPA ? Math.abs(user.actualCGPA - user.guessedCGPA) : null,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
} 