import { useMemo, useState } from "react";
export type DataType = {
	loggedIn: boolean;
	setLoggedIn: (loggedIn: boolean) => void;
	userId: string;
	setUserId: (userId: string) => void;
};
const AllData = () => {
	const [userId, setUserId] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);

	const provider = useMemo(
		() => ({
			loggedIn,
			setLoggedIn,
			userId,
			setUserId,
		}),
		[loggedIn, setLoggedIn, userId, setUserId]
	);
	return provider;
};

export default AllData;
