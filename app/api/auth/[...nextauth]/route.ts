import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '~/app/lib/mongodb';
import User from '~/app/models/User';

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
        if (!credentials?.username) return null;
        const username = credentials.username.toLowerCase();
        await connectDB();
        let user = await User.findOne({ username });
        if (!user) {
          user = await User.create({
            username,
            guessedCGPA: guessedCGPAMap[username] || 0,
            isAdmin: username === 'tushar',
          });
        } else {
          if (user.guessedCGPA === 0 && guessedCGPAMap[username]) {
            user.guessedCGPA = guessedCGPAMap[username];
          }
          if (username === 'tushar' && !user.isAdmin) {
            user.isAdmin = true;
          }
          await user.save();
        }
        return {
          id: user._id.toString(),
          name: user.username,
          isAdmin: user.isAdmin,
        };
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
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 