import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TransitionSpecs } from "@react-navigation/stack";
import { Colors } from "../styles/theme";

// ------------- Pages -------------
import HomePage from "../pages/home";
import PartyPage from "../pages/party/party";
import ProfilePage from "../pages/profile";
import SignUpPage from "../pages/auth/signUp";
import VerifyPhonePage from "../pages/auth/verifyPhone";
import AccountDetailsScreen from "../pages/auth/accountDetails";
import CameraPage from "../pages/party/cameraPage";
import CreatePartyPage from "../pages/createParty";
import InviteToParty from "../pages/party/inviteToParty";
import FriendsPage from "../pages/friends";
import TakeProfilePicture from "../pages/takeProfilePicture";
import Settings from "../pages/settings";
import LoginPage from "../pages/auth/login";
import SplashPage from "../pages/splash";
import Post from "../pages/post";
import PostPage from "../pages/post";
import EditProfile from "../pages/editProfile";
import EditProfilePage from "../pages/editProfile";
import ReportPage from "../pages/report";
import BlockedUsersPage from "../pages/settings/blockedUsers";
import TermsAndConditions from "../pages/terms";
import PartyAttendees from "../pages/party/partyAttendees";
import PartySettings from "../pages/party/partySettings";
import ForgotPassPage from "../pages/auth/forgotPass";
import VerifyPassPage from "../pages/auth/verifyForgotPass";
import ArchivePage from "../pages/settings/archive";

export type RootStackParamList = {
	Splash: undefined;
	Home: undefined;
	Terms: undefined;
	Party: { partyId: string; justCreated?: boolean };
	Post: { postId: string };
	CreateParty: undefined;
	JoinParty: undefined;
	InviteToParty: { eventId: string };
	PartyAttendees: { eventId: string; isHost: boolean; name: string };
	Friends: undefined;
	PartySettings: { eventId: string };
	Camera: { partyId: string };
	TakeProfilePicture: undefined;
	Profile: undefined;
	EditProfile: undefined;
	SignUp: undefined;
	Login: undefined;
	VerifyPhone: { phone: string };
	AccountDetails: undefined;
	Settings: undefined;
	Report: { type: string; id: string };
	Blocked: undefined;
	VerifyPass: { phone: string };
	ForgotPass: undefined;
	Archive: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{ headerShown: false }}
			initialRouteName={"Splash"}>
			<Stack.Screen name="Splash" component={SplashPage} />
			<Stack.Screen
				name="Home"
				component={HomePage}
				options={{ gestureEnabled: false }}
			/>
			<Stack.Screen name="Terms" component={TermsAndConditions} />

			<Stack.Screen name="Party" component={PartyPage} />
			<Stack.Screen name="PartyAttendees" component={PartyAttendees} />
			<Stack.Screen name="Post" component={PostPage} />
			<Stack.Screen name="CreateParty" component={CreatePartyPage} />
			<Stack.Screen name="InviteToParty" component={InviteToParty} />
			<Stack.Screen
				name="Friends"
				component={FriendsPage}
				options={{
					transitionSpec: {
						open: TransitionSpecs.TransitionIOSSpec,
						close: TransitionSpecs.TransitionIOSSpec,
					},
					cardStyleInterpolator: ({ current: { progress } }) => ({
						cardStyle: {
							transform: [
								{
									translateX: progress.interpolate({
										inputRange: [0, 1],
										outputRange: [-1000, 0],
									}),
								},
							],
						},
					}),
				}}
			/>
			<Stack.Screen name="PartySettings" component={PartySettings} />
			<Stack.Screen name="Camera" component={CameraPage} />
			<Stack.Screen name="Profile" component={ProfilePage} />
			<Stack.Screen name="EditProfile" component={EditProfilePage} />
			<Stack.Screen name="TakeProfilePicture" component={TakeProfilePicture} />

			<Stack.Screen
				name="SignUp"
				component={SignUpPage}
				options={{ gestureEnabled: false }}
			/>
			<Stack.Screen name="Login" component={LoginPage} />
			<Stack.Screen name="VerifyPhone" component={VerifyPhonePage} />
			<Stack.Screen name="AccountDetails" component={AccountDetailsScreen} />
			<Stack.Screen name="Report" component={ReportPage} />
			<Stack.Screen name="Settings" component={Settings} />
			<Stack.Screen name="Blocked" component={BlockedUsersPage} />
			<Stack.Screen name="ForgotPass" component={ForgotPassPage} />
			<Stack.Screen name="VerifyPass" component={VerifyPassPage} />
			<Stack.Screen name="Archive" component={ArchivePage} />
		</Stack.Navigator>
	);
}
