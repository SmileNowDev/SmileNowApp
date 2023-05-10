import React, { useState, useEffect, useRef } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	Platform,
	FlatList,
} from "react-native";
import { Fonts, Colors } from "../styles/theme";
import { ButtonStyles, GlobalStyles } from "../styles/styles";
import PartyListItem from "../components/partyListItem";
import HomeHeader from "../components/layout/homeHeader";
import eventApi from "../api/post/event";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import userApi from "../api/user/user";
import * as Device from "expo-device";
import { getInitials } from "./friends";
import ScreenWrapper from "../components/core/screenWrapper";
import WelcomeMessage from "../components/info/welcomeMessage";
import ModalWrapper from "../components/core/modalWrapper";
import JoinPartyPage from "./joinParty";
export default function HomePage({ navigation }) {
	//todo: give events a type
	const [events, setEvents] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [bottomLoading, setBottomLoading] = useState(false);
	const [joining, setJoining] = useState(false);

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
			navigation.navigate("Party", {
				// @ts-expect-error
				eventId: result.data._id,
				justCreated: true,
			});
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
					navigation.navigate(data.screen, data.params);
				}
			});
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ModalWrapper visible={joining} setVisible={setJoining} fullHeight={true}>
				<JoinPartyPage setVisible={setJoining} />
			</ModalWrapper>
			<HomeHeader />
			<ScreenWrapper
				onRefresh={onRefresh}
				scrollEnabled={true}
				loading={loading}
				onBottomScroll={loadMoreEvents}
				bottomLoading={bottomLoading}
				style={{ paddingHorizontal: 0 }}
			>
				{events.length === 0 ? (
					<>
						<WelcomeMessage />
					</>
				) : (
					<>
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
							keyExtractor={(item) => item._id}
							renderItem={({ item, index }) => (
								<View
									style={{
										paddingHorizontal: 10,
										backgroundColor:
											index % 2 === 0 ? Colors.background : Colors.border,
									}}
								>
									<PartyListItem
										initials={getInitials(
											item.title.split(" ")[0],
											item.title.split(" ")[1]
										)}
										name={item.title}
										eventId={item._id}
										canPost={item.canPost}
										attendeeInfo={item.attendeeInfo}
										isActive={item.isActive}
									/>
								</View>
							)}
							onEndReached={() => setPage((prevPage) => prevPage + 1)}
							onEndReachedThreshold={0.1}
						/>
					</>
				)}
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
					onPress={() => setJoining(true)}
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
		</SafeAreaView>
	);
}
