import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Context, Provider as MyProvider } from "./providers/provider";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";
import { loadFonts } from "./utils/loadFonts";
import RootNavigator from "./navigation/rootNavigator";

export default function App() {
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const fontsAreLoaded = loadFonts();

	useEffect(() => {
		async function prepare() {
			await SplashScreen.preventAutoHideAsync();

			if (fontsAreLoaded) {
				try {
					await SplashScreen.hideAsync();
				} catch (error) {
					console.warn("Failed to hide the splash screen:", error);
				}
				setFontsLoaded(true);
			}
		}

		prepare();
	}, []);
	if (!fontsLoaded) {
		return <View></View>;
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
