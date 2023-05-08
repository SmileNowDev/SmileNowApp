import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as MyProvider } from "./providers/provider";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";

import { BeansProvider, extendTheme } from "rn-beans-ui";
import { myCustomTheme } from "./styles/beansTheme";
import { loadFonts } from "./utils/loadFonts";
import RootNavigator from "./navigation/rootNavigator";
import { useColorScheme, Text } from "react-native";

export default function App() {
	const colorScheme = useColorScheme();
	let fontsLoaded = loadFonts();
	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<BeansProvider customTheme={myCustomTheme}>
				<MyProvider>
					<StatusBar style="auto" />
					<NavigationContainer>
						<RootNavigator />
					</NavigationContainer>
				</MyProvider>
			</BeansProvider>
		);
	}
}
