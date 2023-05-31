import React, { useState, useEffect, useRef } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	Platform,
	FlatList,
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
export default function ArchivePage({ navigation }) {
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
		const result = await archiveApi.getArchives({ page: 1 });
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
		const result = await archiveApi.getArchives({ page: nextPage });

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

	function onRefresh() {
		getEvents();
	}

	useEffect(() => {
		getEvents();
	}, []);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Header goBack title="Archive" />
			<ScreenWrapper
				onRefresh={onRefresh}
				scrollEnabled={true}
				loading={loading}
				onBottomScroll={loadMoreEvents}
				bottomLoading={bottomLoading}
				style={{ paddingHorizontal: 0 }}>
				<>
					<FlatList
						data={events}
						keyExtractor={(item) => item._id}
						renderItem={({ item, index }) => (
							<View
								style={{
									paddingHorizontal: 10,
									backgroundColor:
										index % 2 === 0 ? Colors.background : Colors.border,
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
							</View>
						)}
						onEndReached={() => setPage((prevPage) => prevPage + 1)}
						onEndReachedThreshold={0.1}
					/>
				</>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
