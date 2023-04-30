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
import CreatePartyPage from "./pages/createParty";
import JoinPartyPage from "./pages/joinParty";
import InviteToParty from "./pages/inviteToParty";
import PartyDetailsPage from "./pages/partyDetails";
import FriendsPage from "./pages/friends";
import { StatusBar } from "expo-status-bar";
import { Colors } from "./styles/theme";
import TakeProfilePicture from "./pages/takeProfilePicture";
import Settings from "./pages/settings";
import LoginPage from "./pages/auth/login";

type RootStackParamList = {
	Home: undefined;
	Party: { partyId: string };
	CreateParty: undefined;
	JoinParty: undefined;
	InviteToParty: { joinCode: string; eventId: string };
	Friends: undefined;
	PartyDetails: { partyId: string };
	Camera: { partyId: string };
	TakeProfilePicture: undefined;
	Profile: undefined;
	SignUp: undefined;
	Login: undefined;
	VerifyPhone: { phone: string };
	AccountDetails: undefined;
	Settings: undefined;
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
				<StatusBar style="auto" />
				<NavigationContainer>
					<Stack.Navigator
						screenOptions={{ headerShown: false }}
						initialRouteName={loggedIn ? "Home" : "SignUp"}>
						<Stack.Screen name="Home" component={HomePage} />
						<Stack.Screen name="Party" component={PartyPage} />
						<Stack.Screen name="JoinParty" component={JoinPartyPage} />
						<Stack.Screen name="CreateParty" component={CreatePartyPage} />
						<Stack.Screen name="InviteToParty" component={InviteToParty} />
						<Stack.Screen name="Friends" component={FriendsPage} />
						<Stack.Screen name="PartyDetails" component={PartyDetailsPage} />
						<Stack.Screen name="Camera" component={CameraPage} />
						<Stack.Screen name="Profile" component={ProfilePage} />
						<Stack.Screen
							name="TakeProfilePicture"
							component={TakeProfilePicture}
						/>

						<Stack.Screen name="SignUp" component={SignUpPage} />
						<Stack.Screen name="Login" component={LoginPage} />
						<Stack.Screen name="VerifyPhone" component={VerifyPhonePage} />
						<Stack.Screen
							name="AccountDetails"
							component={AccountDetailsScreen}
						/>
						<Stack.Screen name="Settings" component={Settings} />
					</Stack.Navigator>
				</NavigationContainer>
			</MyProvider>
		);
	}
}
