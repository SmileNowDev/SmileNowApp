import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Context, Provider as MyProvider } from "./providers/provider";
import "react-native-gesture-handler";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";

import { loadFonts } from "./utils/loadFonts";
import RootNavigator from "./navigation/rootNavigator";

export default function App() {
	let fontsLoaded = loadFonts();
	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<MyProvider>
				<StatusBar style="dark" />
				<NavigationContainer>
					<RootNavigator />
				</NavigationContainer>
			</MyProvider>
		);
	}
}
