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
import { initializeApp } from "firebase/app";
import "firebase/analytics";
// @ts-ignore
import { GOOGLE_API_KEY } from "@env";
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
	const firebaseConfig = {
		apiKey: GOOGLE_API_KEY,
		authDomain: "smilenowapp.firebaseapp.com",
		projectId: "smilenowapp",
		storageBucket: "smilenowapp.appspot.com",
		messagingSenderId: "1047765184",
		appId: "1:1047765184:web:788ca45ef14b7935b28d25",
		measurementId: "G-J8T77YKC9X",
	};

	const app = initializeApp(firebaseConfig);
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
				<QueryClientProvider client={queryClient}>
					<NavigationContainer>
						<RootNavigator />
					</NavigationContainer>
				</QueryClientProvider>
			</MyProvider>
		);
	}
}
