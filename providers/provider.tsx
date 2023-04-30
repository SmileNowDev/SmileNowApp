import React, { createContext } from "react";
import AllData, { DataType } from "./context";

export const Context = createContext<DataType>({
	loggedIn: false,
	setLoggedIn: (boolean) => {},
	userId: "",
	setUserId: (string) => {},
});

export const Provider = ({ children }) => {
	const data: DataType = AllData();
	return <Context.Provider value={data}>{children}</Context.Provider>;
};
