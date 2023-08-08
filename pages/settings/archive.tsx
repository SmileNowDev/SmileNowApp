import React, { useState, useEffect, useCallback } from "react";
import {
	SafeAreaView,
	View,
	FlatList,
	ActivityIndicator,
	Text,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import PartyListItem from "../../components/home/partyListItem";

import { getInitials } from "../friends";
import ScreenWrapper from "../../components/core/screenWrapper";
import archiveApi from "../../api/post/archive";
import Header from "../../components/layout/header";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";
import { EventType } from "../home";
import { Dim } from "../../styles/styles";
export default function ArchivePage({ navigation }) {
	//todo: test the pagination on this page
	const isFocused = useIsFocused();
	const queryClient = useQueryClient();
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [events, setEvents] = useState([]);

	// ... (other functions)
	const {
		data,
		isLoading,
		status,
		refetch,
		isFetching,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["archived_events", page],
		queryFn: ({ pageParam = 1 }) => getEvents({ pageParam }),
		getPreviousPageParam: (lastPage, allPages) => {
			return lastPage.hasNextPage ? allPages.length + 1 : false;
		},
	});
	useEffect(() => {
		if (isFocused) {
			onRefresh();
		}
	}, [isFocused]);
	useEffect(() => {
		if (data) {
			let events = data.pages.flat()[0].events as EventType[];
			setEvents(events);
		}
	}, [data]);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		queryClient.invalidateQueries(["events"]);
		queryClient.invalidateQueries(["requests"]);
		refetch();
		setRefreshing(false);
	}, []);
	async function getEvents({ pageParam = 1 }) {
		setPage(pageParam);
		const result = await archiveApi.getArchives({ page: 1 });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			return {
				//@ts-expect-error
				events: result.data.data,
				//@ts-expect-error-
				hasNextPage: result.data.next,
			};
		}
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Header goBack title="Archive" />
			<ScreenWrapper
				onRefresh={onRefresh}
				scrollEnabled={true}
				loading={isLoading}
				// onBottomScroll={fetchNextPage}
				// bottomLoading={isFetchingNextPage}
				style={{ paddingHorizontal: 0 }}>
				<>
					<FlatList
						style={{ paddingTop: 20 }}
						data={events}
						keyExtractor={(item) => item._id}
						ListHeaderComponent={
							<View>
								{isFetching && <ActivityIndicator color={Colors.primary} />}
							</View>
						}
						renderItem={({ item, index }) => (
							<View
								key={item._id}
								style={{
									// shadowColor: "#000",
									// shadowOffset: {
									// 	width: 0,
									// 	height: 2,
									// },
									// shadowOpacity: 0.125,
									// shadowRadius: 2.5,
									// elevation: 2,
									marginBottom: 15,
								}}>
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
								{/* todo: add action buttons here to unarchive and delete */}
							</View>
						)}
						onEndReached={() => {
							// console.log("end reached");
							if (hasNextPage) fetchNextPage();
						}}
						onEndReachedThreshold={0.25}
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
				</>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
