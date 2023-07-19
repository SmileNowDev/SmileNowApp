import React from "react";

type DataContextType = {
	data: any; // replace 'any' with the type of your data
	setData: (newData: any) => void; // replace 'any' with the type of your data
};

export const DataContext = React.createContext<DataContextType | undefined>(
	undefined
);
