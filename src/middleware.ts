import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const url = process.env.NEXT_PUBLIC_API_URL;

export default withAuth(
	// `withAuth` augments your `Request` with the user's token.
	async function middleware(req) {
		const token = req.nextauth.token;

		if (token) {
			const pathname = req.nextUrl.pathname;

			const dynamicPaths = ["[id]", "[token]"];
			// Find a matching path with dynamic path handling
			const path = paths.find(p => {
				if (dynamicPaths.some(dp => p.path.includes(dp))) {
					const regex = new RegExp(p.path.replace(/\[.*?\]/g, ".*"));

					return regex.test(pathname);
				}

				return p.path === pathname;
			});

			if (!path) {
				return NextResponse.redirect(new URL("/", req.url));
			}

			const userPermissions = token.role.permissions || [];
			const hasPermission = path.permission.some(p =>
				userPermissions.includes(p)
			);

			if (!hasPermission) {
				return NextResponse.redirect(new URL("/access-denied", req.url));
			}

			return NextResponse.next();
		} else {
			if (
				req.nextUrl.pathname === "/login" ||
				req.nextUrl.pathname === "/employee-login" ||
				req.nextUrl.pathname === "/admin-login"
			)
				return NextResponse.next();
			else if (
				req.nextUrl.pathname.startsWith("/app") ||
				req.nextUrl.pathname.startsWith("/app/employee") ||
				req.nextUrl.pathname.startsWith("/app/admin/employees")
			) {
				return NextResponse.redirect(new URL("/", req.url));
			}
		}
	},
	{
		callbacks: {
			authorized: async ({ token }) => {
				return true;
			},
		},
	}
);

export const config = {
	// https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|auth/|access-denied|forgot-password|estimate-cost|tracking-shipment|reset-password|register|news/*|$).*)",
	],
};

const paths = [
	{
		path: "/app",
		permission: ["app.view"],
	},
	//---- User ----//
	{
		path: "/app/user",
		permission: ["user.view"],
	},
	{
		path: "/app/employee",
		permission: ["profile.view"],
	},
	{
		path: "/app/user/change-password",
		permission: ["password.change"],
	},
	{
		path: "/app/user/packages",
		permission: ["package.view"],
	},
	{
		path: "/app/user/create-package",
		permission: ["package.create"],
	},
	{
		path: "/app/user/add-address",
		permission: ["address.create"],
	},
	{
		path: "/app/user/addresses/receiver",
		permission: ["addresses.view"],
	},
	{
		path: "/app/user/addresses/sender",
		permission: ["addresses.view"],
	},
	{
		path: "/app/user/addresses",
		permission: ["addresses.view"],
	},
	{
		path: "/app/user/historylogs",
		permission: ["user.view"],
	},
	//---- Admin ----//
	{
		path: "/app/packages",
		permission: ["package.view", "emp.view"],
	},
	{
		path: "/app/employees",
		permission: ["emp.view"],
	},
	{
		path: "/app/roles",
		permission: ["role.view"],
	},
	{
		path: "/app/requests",
		permission: ["request.view"],
	},
	{
		path: "/app/users",
		permission: ["emp.view"],
	},
	{
		path: "/app/historylogs",
		permission: ["emp.view"],
	},
	{
		path: "/app/branches",
		permission: ["branches.view", "emp.view"],
	},
	{
		path: "/app/create-package",
		permission: ["emp.view", "user.view"],
	},
	{
		path: "/app/service",
		permission: ["service.view", "emp.view"],
	},
	{
		path: "/app/news-management",
		permission: ["new.create"],
	},
	{
		path: "/app/feecustom",
		permission: ["fee.view"],
	},
	{
		path: "/app/feecustom/manager",
		permission: ["fee.create"],
	},
	{
		path: "/app/general-settings",
		permission: ["emp.create"],
	},
	{
		path: "/app/service-type",
		permission: ["servicetype.view"],
	},
	{
		path: "/app/services",
		permission: ["servicetype.view"],
	},
	{
		path: "/app/packages/[id]",
		permission: ["package.view"],
	},
];
