import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Context, Provider as MyProvider } from "./providers/provider";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { AppStateStatus, Platform, View } from "react-native";
import { loadFonts } from "./utils/loadFonts";
import RootNavigator from "./navigation/rootNavigator";
import {
	QueryClient,
	QueryClientProvider,
	focusManager,
} from "@tanstack/react-query";
// @ts-ignore
import { GOOGLE_API_KEY } from "@env";
import { ToastProvider } from "react-native-toast-notifications";
const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: 2 } },
});
function onAppStateChange(status: AppStateStatus) {
	// React Query already supports in web browser refetch on window focus by default
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}
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
	}, [fontsAreLoaded]);
	if (!fontsLoaded) {
		return <View></View>;
	} else {
		return (
			<MyProvider>
				<StatusBar style="dark" />
				<ToastProvider placement="top" offsetTop={50}>
					<QueryClientProvider client={queryClient}>
						<NavigationContainer>
							<RootNavigator />
						</NavigationContainer>
					</QueryClientProvider>
				</ToastProvider>
			</MyProvider>
		);
	}
}
