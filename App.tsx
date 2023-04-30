import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Context, Provider as MyProvider } from "./providers/provider";

import AppLoading from "expo-app-loading";
import {
	useFonts,
	LibreFranklin_300Light,
	LibreFranklin_400Regular,
	LibreFranklin_500Medium,
	LibreFranklin_600SemiBold,
	LibreFranklin_700Bold,
	LibreFranklin_800ExtraBold,
} from "@expo-google-fonts/libre-franklin";
import {
	Exo_300Light,
	Exo_400Regular,
	Exo_500Medium,
	Exo_600SemiBold,
	Exo_700Bold,
} from "@expo-google-fonts/exo";
import {
	FuzzyBubbles_400Regular,
	FuzzyBubbles_700Bold,
} from "@expo-google-fonts/fuzzy-bubbles";
import HomePage from "./pages/home";
import PartyPage from "./pages/party";
import ProfilePage from "./pages/profile";
import SignUpPage from "./pages/auth/signUp";
import VerifyPhonePage from "./pages/auth/verifyPhone";
import AccountDetailsScreen from "./pages/auth/accountDetails";
import { createStackNavigator } from "@react-navigation/stack";
import CameraPage from "./pages/cameraPage";

type RootStackParamList = {
	Home: undefined;
	Party: { partyId: string };
	Camera: { partyId: string };
	Profile: undefined;
	SignUp: undefined;
	VerifyPhone: undefined;
	AccountDetails: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	const { loggedIn, setLoggedIn } = useContext(Context);

	let [fontsLoaded] = useFonts({
		LibreFranklin_300Light,
		LibreFranklin_400Regular,
		LibreFranklin_500Medium,
		LibreFranklin_600SemiBold,
		LibreFranklin_700Bold,
		LibreFranklin_800ExtraBold,
		Exo_300Light,
		Exo_400Regular,
		Exo_500Medium,
		Exo_600SemiBold,
		Exo_700Bold,
		FuzzyBubbles_400Regular,
		FuzzyBubbles_700Bold,
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	} else {
		return (
			<MyProvider>
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{ headerShown: false }}
						initialRouteName="Home">
						<>
							<Stack.Screen name="Home" component={HomePage} />
							<Stack.Screen name="Party" component={PartyPage} />
							<Stack.Screen name="Camera" component={CameraPage} />
							<Stack.Screen name="Profile" component={ProfilePage} />

							<Stack.Screen name="SignUp" component={SignUpPage} />
							<Stack.Screen name="VerifyPhone" component={VerifyPhonePage} />
							<Stack.Screen
								name="AccountDetails"
								component={AccountDetailsScreen}
							/>
						</>
					</Stack.Navigator>
				</NavigationContainer>
			</MyProvider>
		);
	}
}
