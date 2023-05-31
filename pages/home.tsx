import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	FlatList,
	StyleSheet,
	RefreshControl,
} from "react-native";
import { Fonts, Colors } from "../styles/theme";
import { ButtonStyles, Dim, GlobalStyles } from "../styles/styles";
import PartyListItem from "../components/home/partyListItem";
import HomeHeader from "../components/layout/homeHeader";
import eventApi from "../api/post/event";
import * as Notifications from "expo-notifications";
import { getInitials } from "./friends";
import ScreenWrapper from "../components/core/screenWrapper";
import WelcomeMessage from "../components/info/welcomeMessage";
import ModalWrapper from "../components/core/modalWrapper";
import JoinPartyPage from "./joinParty";
import { registerForPushNotificationsAsync } from "../lib/notifications";
import {
	useQuery,
	useInfiniteQuery,
	useQueryClient,
} from "@tanstack/react-query";
import CreateJoin from "../components/home/createJoin";
type EventType = {
	_id: string;
	title: string;
	canPost: boolean;
	attendeeInfo: { isHost: boolean; muted: boolean };
	isActive: boolean;
};
export default function HomePage({ navigation }) {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [refreshing, setRefreshing] = useState(false);

	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ["events", page],
		queryFn: ({ pageParam = 1 }) => getEvents({ pageParam }),
		getNextPageParam: (lastPage) => {
			return hasNextPage ? page + 1 : undefined;
		},
	});
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		queryClient.invalidateQueries(["events"]);
		setRefreshing(false);
	}, []);
	async function getEvents({ pageParam = 1 }) {
		setPage(pageParam);
		console.log("Page", pageParam);
		const result = await eventApi.getEvents({ page: pageParam });
		if (!result.ok) {
			throw new Error(result.problem);
		}
		console.log(result.data);
		return result.data;
	}
	// async function loadMoreEvents() {
	// 	if (!hasMore) {
	// 		return;
	// 	}

	// 	setBottomLoading(true);
	// 	const nextPage = page + 1;
	// 	const result = await eventApi.getEvents({ page: nextPage });

	// 	if (result.ok) {
	// 		// @ts-expect-error
	// 		if (result.data.length > 0) {
	// 			//@ts-expect-error
	// 			setEvents((prevEvents) => [...prevEvents, ...result.data]);
	// 			setPage(nextPage);
	// 		} else {
	// 			setHasMore(false);
	// 		}
	// 	}

	// 	setBottomLoading(false);
	// }

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
	if (isLoading) return <Text style={{ padding: 50 }}>Loading...</Text>;
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<HomeHeader />
			<CreateJoin navigation={navigation} />
			<ScreenWrapper
				onRefresh={fetchNextPage}
				scrollEnabled={true}
				loading={isLoading}
				style={{ paddingHorizontal: 0 }}>
				{!data.pages.flat() ? (
					<>
						<WelcomeMessage />
					</>
				) : (
					<>
						{data.pages.flat().length === 0 ? (
							<></>
						) : (
							<View style={{ flex: 1 }}>
								<FlatList
									ListHeaderComponent={
										<Text
											style={{
												fontFamily: Fonts.title.fontFamily,
												fontSize: Fonts.subTitle.fontSize,
												padding: 10,
											}}>
											My Parties
										</Text>
									}
									refreshControl={
										<RefreshControl
											refreshing={refreshing}
											onRefresh={onRefresh}
										/>
									}
									style={{ flex: 1 }}
									data={data.pages.flat() as EventType[]}
									keyExtractor={(item) => item._id}
									renderItem={({ item, index }) => {
										return (
											<View
												style={{
													paddingHorizontal: 10,
													backgroundColor:
														index % 2 === 0 ? Colors.background : Colors.border,
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
									onEndReached={() => {
										if (hasNextPage) fetchNextPage();
									}}
									onEndReachedThreshold={0.5}
									ListFooterComponent={
										<View
											style={{
												height: 150,
												width: Dim.width,
												justifyContent: "center",
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
							</View>
						)}
					</>
				)}
			</ScreenWrapper>
		</SafeAreaView>
	);
}
