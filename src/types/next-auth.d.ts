import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			id: number;
			fullname: string;
			email: string;
			phoneNumber: string;
			avatar?: string;
			token: string;
			role: {
				name: string;
				permissions: string[];
			};
			employeeCode?: string;
			address?: string;
			province?: string;
			district?: string;
			postalCode?: string;
			branchId?: numger;
			branchName?: string;
		};
	}

	interface User {
		id: number;
		fullname: string;
		email: string;
		phoneNumber: string;
		avatar?: string;
		token: string;
		role: {
			name: string;
			permissions: string[];
		};
		employeeCode?: string;
		address?: string;
		province?: string;
		district?: string;
		postalCode?: string;
		branchId?: numger;
		branchName?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		/** This is an example. You can find me in types/next-auth.d.ts */
		id: number;
		fullname: string;
		email: string;
		phoneNumber: string;
		avatar?: string;
		token: string;
		role: {
			name: string;
			permissions: string[];
		};
		employeeCode?: string;
		address?: string;
		province?: string;
		district?: string;
		postalCode?: string;
		branchId?: numger;
		branchName?: string;
	}
}
