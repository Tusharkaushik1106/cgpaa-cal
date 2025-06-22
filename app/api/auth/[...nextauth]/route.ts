import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '~/app/lib/mongodb';
import User from '~/app/models/User';

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      isAdmin?: boolean
    }
  }

  interface User {
    isAdmin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean
  }
}

const guessedCGPAMap: Record<string, number> = {
  divij: 9.38,
  akshar: 9.21,
  tushar: 8.74,
  piyush: 8.54,
  purav: 8.34,
  sarthak: 7.74,
  singh: 7.63,
  laksh: 9.12,
  ahuja: 8.06,
  gaurav: 9.16,
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" }
      },
      async authorize(credentials) {
        console.log('Attempting to authorize with credentials:', credentials);
        if (!credentials?.username) {
          console.log('No username provided in credentials.');
          return null;
        }
        const username = credentials.username.toLowerCase();
        try {
          console.log('Attempting to connect to MongoDB...');
          await connectDB();
          console.log('MongoDB connected successfully.');
          console.log('Attempting to find user:', username);
          let user = await User.findOne({ username });
          if (!user) {
            console.log('User not found, attempting to create:', username);
            user = await User.create({
              username,
              guessedCGPA: guessedCGPAMap[username] || 0,
              isAdmin: username === 'tushar',
            });
            console.log('User created successfully:', user);
          } else {
            console.log('User found:', user);
            if (user.guessedCGPA === 0 && guessedCGPAMap[username]) {
              console.log('Updating user guessedCGPA...');
              user.guessedCGPA = guessedCGPAMap[username];
              await user.save();
              console.log('User guessedCGPA updated successfully:', user);
            }
            if (username === 'tushar' && !user.isAdmin) {
              console.log('Updating user isAdmin status...');
              user.isAdmin = true;
              await user.save();
              console.log('User isAdmin updated successfully:', user);
            }
          }
          console.log('Authorization successful for user:', user.username);
          return {
            id: user._id.toString(),
            name: user.username,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null; // Return null on any error during the process
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 