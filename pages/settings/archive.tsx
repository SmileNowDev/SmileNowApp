import React, { useState, useEffect, useRef, useCallback } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	Platform,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { Fonts, Colors } from "../../styles/theme";
import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import PartyListItem from "../../components/home/partyListItem";
import HomeHeader from "../../components/layout/homeHeader";
import eventApi from "../../api/post/event";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import userApi from "../../api/user/user";
import * as Device from "expo-device";
import { getInitials } from "../friends";
import ScreenWrapper from "../../components/core/screenWrapper";
import WelcomeMessage from "../../components/info/welcomeMessage";
import ModalWrapper from "../../components/core/modalWrapper";
import JoinPartyPage from "../joinParty";
import archiveApi from "../../api/post/archive";
import Header from "../../components/layout/header";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { useIsFocused } from "@react-navigation/native";
export default function ArchivePage({ navigation }) {
	//todo: test the pagination on this page
	const isFocused = useIsFocused();
	const queryClient = useQueryClient();
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [loading, setLoading] = useState(false);
	const [bottomLoading, setBottomLoading] = useState(false);

	// ... (other functions)
	const { data, isLoading, status, refetch, isFetching } = useQuery({
		queryKey: ["archived_events", page],
		queryFn: ({ pageParam = 1 }) => getEvents({ pageParam }),
	});
	useEffect(() => {
		if (isFocused) {
			onRefresh();
		}
	}, [isFocused]);

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
			return result.data;
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
						//@ts-expect-error
						data={data}
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
					/>
				</>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
