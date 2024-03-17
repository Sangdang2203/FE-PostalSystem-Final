// @ts-ignore
import { UserWithAll } from "@/types";
import React from "react";
import { useSession } from "next-auth/react";

interface UserContextProps {
	userWithAll: UserWithAll | null;
}

const UserContext = React.createContext<UserContextProps | null>(null);

export function UserContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [userWithAll, setUserWithAll] = React.useState<UserWithAll | null>(
		null
	);
	const { data: session } = useSession();

	React.useEffect(() => {
		async function fetchData() {
			const res = await fetch(`/api/users/${session?.user.id}/all`);

			const payload = await res.json();

			if (payload.ok) {
				setUserWithAll(payload.data);
			} else {
			}
		}
		fetchData();
	}, [session]);
	return (
		<UserContext.Provider value={{ userWithAll }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = React.useContext(UserContext);
	if (context === undefined) {
		throw new Error("Context must be used within a Provider");
	}
	return context;
}
