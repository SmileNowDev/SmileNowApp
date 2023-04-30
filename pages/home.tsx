import React, { useState, useEffect, useRef } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	Platform,
	Alert,
	ScrollView,
	RefreshControl,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import { ButtonStyles, GlobalStyles } from "../styles/styles";
import PartyListItem from "../components/partyListItem";
import HomeHeader from "../components/homeHeader";
import eventApi from "../api/post/event";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import userApi from "../api/user/user";
import * as Device from "expo-device";
export default function HomePage({ navigation }) {
	const [events, setEvents] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	async function createEvent() {
		const result = await eventApi.create();
		if (result.ok) {
			//@ts-expect-error
			navigation.navigate("CreateParty", { eventId: result.data._id });
		}
	}

	async function getEvents() {
		const result = await eventApi.getEvents({ page: 1 });
		if (result.ok) {
			// @ts-expect-error
			setEvents(result.data);
		}
	}

	const uploadToken = async (expoNotificationToken: string) => {
		const result = await userApi.updateUser({ expoNotificationToken });
		if (result.ok) {
		}
	};
	// Functions
	async function registerForPushNotificationsAsync() {
		let token;

		if (Platform.OS === "android") {
			await Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		if (Device.isDevice) {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
			await uploadToken(token);
		} else {
		}

		return token;
	}
	function onRefresh() {
		getEvents();
	}

	useEffect(() => {
		getEvents();
		registerForPushNotificationsAsync();
	}, []);
	const notificationListener = useRef();
	const responseListener = useRef();

	useEffect(() => {
		//@ts-expect-error
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {});
		//@ts-expect-error

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				let data = response.notification.request.content.data;

				if (data.type === "navigation") {
					navigation.navigate("Camera", data.params);
				}
			});
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HomeHeader />
			<ScrollView
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}>
				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
						padding: 10,
					}}>
					My Parties
				</Text>
				{events.map(function (item: any, index: number) {
					return (
						<PartyListItem
							icon={"🥰"}
							name={item.event.title}
							eventId={item.event._id}
							canPost={item.canPost}
						/>
					);
				})}
			</ScrollView>

			<View
				style={{
					position: "absolute",
					bottom: 30,
					left: -5,
					right: -5,
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 2.5,
					...GlobalStyles.Container,

					flex: 0,
				}}>
				<TouchableOpacity
					onPress={() => navigation.navigate("JoinParty")}
					style={{ ...ButtonStyles.secondary, ...ButtonStyles.buttonLarge }}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Join Party</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={createEvent}
					style={{ ...ButtonStyles.primary, ...ButtonStyles.buttonLarge }}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Create Party</Text>
				</TouchableOpacity>
			</View>

			{/* list of parties you've been to */}
		</SafeAreaView>
	);
}
