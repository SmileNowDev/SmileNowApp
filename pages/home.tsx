import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	SafeAreaView,
	Text,
	View,
	FlatList,
	RefreshControl,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Fonts, Colors } from "../styles/theme";
import { Dim } from "../styles/styles";
import PartyListItem from "../components/home/partyListItem";
import HomeHeader from "../components/layout/homeHeader";
import eventApi from "../api/post/event";
import * as Notifications from "expo-notifications";
import { getInitials } from "./friends";
import ScreenWrapper from "../components/core/screenWrapper";
import WelcomeMessage from "../components/info/welcomeMessage";
import { registerForPushNotificationsAsync } from "../lib/notifications";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import CreateJoin from "../components/home/createJoin";
import { useIsFocused } from "@react-navigation/native";
import PartyLoading from "../components/party/partyLoading";
import WelcomeMessageModal from "../components/engagement/welcomeMessageModal";
export type EventType = {
	_id: string;
	title: string;
	canPost: boolean;
	attendeeInfo: { isHost: boolean; muted: boolean };
	isActive: boolean;
};
export default function HomePage({ navigation }) {
	const isFocused = useIsFocused();
	const queryClient = useQueryClient();
	const [events, setEvents] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		queryClient.invalidateQueries(["events"]);
		queryClient.invalidateQueries(["requests"]);
		refetch();
		setRefreshing(false);
	}, []);
	const {
		data,
		isLoading,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
		status,
		refetch,
		isFetching,
	} = useInfiniteQuery({
		queryKey: ["events"],
		queryFn: ({ pageParam }) => getEvents({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.hasNextPage ? allPages.length + 1 : undefined;
		},
		enabled: isFocused,
		staleTime: 1000 * 60 * 5, // data is considered fresh for 5 minutes
		cacheTime: 1000 * 60 * 30, // data is cached for 30 minutes
	});
	useEffect(() => {
		if (data !== undefined) {
			let events = data.pages.flat()[0].events as any[];
			setEvents(events);
		}
	}, [data]);
	useEffect(() => {
		if (isFocused) {
			onRefresh();
		}
	}, [isFocused]);

	async function getEvents({ pageParam = 1 }) {
		const result = await eventApi.getEvents({ page: pageParam });
		if (!result.ok) {
			throw new Error(result.problem);
		}

		return {
			//@ts-expect-error
			events: result.data.data,
			//@ts-expect-error
			hasNextPage: result.data.next,
		};
	}

	useEffect(() => {
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
		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);
	return (
		<SafeAreaView style={{ flex: 1, height: Dim.height, bottom: -50 }}>
			<HomeHeader />
			<WelcomeMessageModal />
			<CreateJoin navigation={navigation} />
			<>
				{isLoading ? (
					<View
						style={{
							position: "absolute",
							left: 0,
							top: 0,
							bottom: 0,
							right: 0,
							flex: 1,
							height: Dim.height,
							alignContent: "center",
							justifyContent: "center",
						}}>
						<PartyLoading
							variant="white_backdrop"
							message={"Getting all your pictures"}
						/>
					</View>
				) : (
					<>
						{!events.length ? (
							<WelcomeMessage />
						) : (
							<>
								<FlatList
									style={{ marginBottom: 40 }}
									ListHeaderComponent={
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
												paddingRight: 20,
											}}>
											<Text
												style={{
													fontFamily: Fonts.title.fontFamily,
													fontSize: Fonts.subTitle.fontSize,
													padding: 10,
												}}>
												My Parties
											</Text>

											{isFetching && (
												<ActivityIndicator color={Colors.primary} />
											)}
										</View>
									}
									refreshControl={
										<RefreshControl
											refreshing={refreshing}
											onRefresh={onRefresh}
										/>
									}
									scrollEnabled={true}
									onEndReached={() => {
										if (hasNextPage) {
											fetchNextPage();
										}
									}}
									onEndReachedThreshold={0.2}
									data={events}
									keyExtractor={(item) => item._id}
									renderItem={({ item }) => {
										return (
											<View
												key={item._id}
												style={{
													marginBottom: 15,
												}}>
												<PartyListItem
													initials={getInitials(
														item.title?.split(" ")[0],
														item.title?.split(" ")[1]
													)}
													name={item.title}
													eventId={item._id}
													canPost={item.canPost}
													attendeeInfo={item.attendeeInfo}
													isActive={item.isActive}
												/>
											</View>
										);
									}}
									ListFooterComponent={
										<View
											style={{
												height: 250,
												width: Dim.width,
												justifyContent: "flex-start",
												alignItems: "center",
											}}>
											{isFetchingNextPage && (
												<Text
													style={{
														textAlign: "center",
														fontFamily: Fonts.body.fontFamily,
														fontSize: Fonts.body.fontSize,
													}}>
													Getting More Parties... 🎉
												</Text>
											)}
										</View>
									}
								/>
							</>
						)}
					</>
				)}
			</>
		</SafeAreaView>
	);
}
