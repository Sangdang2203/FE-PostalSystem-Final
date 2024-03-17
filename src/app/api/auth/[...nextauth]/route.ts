import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import { parse } from "cookie";

interface RouteHandlerContext {
	params: { nextauth: string[] };
}

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
				role: { label: "Role", type: "text" },
			},
			async authorize(credentials, req) {
				let url = "";

				if (credentials?.role) {
					url = `${process.env.NEXT_PUBLIC_API_URL}/Auth/Login`;
				} else {
					url = `${process.env.NEXT_PUBLIC_API_URL}/Users/Login`;
				}
				try {
					const res = await fetch(url, {
						cache: "no-cache",
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							userId: credentials?.username,
							password: credentials?.password,
						}),
						credentials: "include",
					});

					if (res.ok) {
						const user = await res.json();

						const apiCookies = res.headers.getSetCookie();

						if (apiCookies && apiCookies.length > 0) {
							apiCookies.forEach(cookie => {
								const parsedCookie = parse(cookie);
								const [cookieName, cookieValue] =
									Object.entries(parsedCookie)[0];
								const httpOnly = cookie.includes("httponly");

								cookies().set({
									name: cookieName,
									value: cookieValue,
									httpOnly: httpOnly,
									expires: new Date(parsedCookie.expires),
								});
							});
						}

						if (!user.role) {
							user.role = {
								name: "User",
								permissions: [
									"user.view",
									"app.view",
									"package.view",
									"package.create",
									"address.create",
									"addresses.view",
								],
							};
						}
						return user;
					}
					return null;
				} catch (error) {
					console.log("Error authorize next-auth", error);
					return null;
				}
			},
		}),
		// ...add more providers here
	],
	pages: {
		signIn: "/login",
	},
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (user) {
				token = { ...user, id: +user.id };
			}

			if (trigger === "update") {
				token.token = session.token;
			}

			// return final token
			return token;
		},

		async session({ session, token, user }) {
			session.user = { ...token };

			return session;
		},
	},
};

const handler = async (req: NextRequest, context: RouteHandlerContext) => {
	return NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST };
