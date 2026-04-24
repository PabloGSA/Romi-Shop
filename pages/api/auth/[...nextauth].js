import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("Email o contraseña incorrectos");

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) throw new Error("Email o contraseña incorrectos");

        // Hacemos una consulta directa con lean() para ver el documento crudo de MongoDB
        const userCrudo = await User.findOne({ email: credentials.email }).lean();
        console.log("Documento crudo de MongoDB:", JSON.stringify(userCrudo));

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: userCrudo.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
