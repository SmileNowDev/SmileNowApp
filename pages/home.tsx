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
	FlatList,
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
import { getInitials } from "./friends";
import ScreenWrapper from "../components/core/screenWrapper";
export default function HomePage({ navigation }) {
	const [events, setEvents] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1); // Add this state
	const [hasMore, setHasMore] = useState(true); // Add this state
	const [loading, setLoading] = useState(false); // Add this state
	const [bottomLoading, setBottomLoading] = useState(false); // Add this state

	// ... (other functions)

	async function getEvents() {
		setLoading(true);
		const result = await eventApi.getEvents({ page: 1 });
		if (result.ok) {
			// @ts-expect-error
			setEvents(result.data);
		}
		setLoading(false);
	}

	// Add this function
	async function loadMoreEvents() {
		if (!hasMore) {
			return;
		}

		setBottomLoading(true);
		const nextPage = page + 1;
		const result = await eventApi.getEvents({ page: nextPage });

		if (result.ok) {
			// @ts-expect-error
			if (result.data.length > 0) {
				//@ts-expect-error
				setEvents((prevEvents) => [...prevEvents, ...result.data]);
				setPage(nextPage);
			} else {
				setHasMore(false);
			}
		}

		setBottomLoading(false);
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
	async function createEvent() {
		const result = await eventApi.create();
		if (result.ok) {
			//@ts-expect-error
			navigation.navigate("CreateParty", { eventId: result.data._id });
		}
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
			<ScreenWrapper
				onRefresh={onRefresh}
				scrollEnabled={true}
				loading={loading}
				onBottomScroll={loadMoreEvents}
				bottomLoading={bottomLoading}
			>
				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
						padding: 10,
					}}
				>
					My Parties
				</Text>
				<FlatList
					data={events}
					keyExtractor={(item) => item.event._id}
					renderItem={({ item }) => (
						<PartyListItem
							icon={getInitials(
								item.event.title.split(" ")[0],
								item.event.title.split(" ")[1]
							)}
							name={item.event.title}
							eventId={item.event._id}
							canPost={item.canPost}
						/>
					)}
					onEndReached={() => setPage((prevPage) => prevPage + 1)}
					onEndReachedThreshold={0.1}
				/>
			</ScreenWrapper>

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
				}}
			>
				<TouchableOpacity
					onPress={() => navigation.navigate("JoinParty")}
					style={{ ...ButtonStyles.secondary, ...ButtonStyles.buttonLarge }}
				>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Join Party</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={createEvent}
					style={{ ...ButtonStyles.primary, ...ButtonStyles.buttonLarge }}
				>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Create Party</Text>
				</TouchableOpacity>
			</View>

			{/* list of parties you've been to */}
		</SafeAreaView>
	);
}
