import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	FlatList,
	ActivityIndicator,
	Image,
	Alert,
	TouchableWithoutFeedback,
} from "react-native";
import PartyHeader from "../../components/layout/partyHeader";
import Photo from "../../components/post/photo";
import Icon from "../../components/core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { ButtonStyles, Dim, GlobalStyles } from "../../styles/styles";
import eventApi from "../../api/post/event";
import postApi from "../../api/post/post";
import ScreenWrapper from "../../components/core/screenWrapper";
import EmptyPartyMessage from "../../components/info/emptyPartyMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PartyLoading from "../../components/party/partyLoading";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import ActivateParty from "../../components/party/activateParty";
import TakePhoto from "../../components/party/takePhoto";
import { useIsFocused } from "@react-navigation/native";
export type NotificationFrequencyType = "slow" | "normal" | "fast";
export interface IEvent {
	_id: string;
	title: string;
	description: string;
	canPost: boolean;
	isHost: boolean;
	muted: boolean;
	isActive: boolean;
	archived: boolean;
	notificationFrequency: NotificationFrequencyType;
}

export default function PartyPage({ route, navigation }) {
	const isFocused = useIsFocused();
	const queryClient = useQueryClient();
	const { eventId, justCreated } = route.params;
	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		if (isFocused) {
			refetch();
		}
	}, [isFocused]);

	// EVENT
	const { isLoading, error, data, refetch } = useQuery<IEvent>({
		queryKey: ["event", eventId],
		queryFn: getEvent,
	});
	async function getEvent() {
		// console.log("getting event");
		const result = await eventApi.getEvent({ eventId });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			let _archived = false;
			//@ts-expect-error
			if (result.data.isArchived !== null) {
				_archived = true;
			}
			let _frequency: NotificationFrequencyType = "normal";
			//@ts-expect-error
			if (result.data.event.settings.notificationFrequency) {
				//@ts-expect-error
				_frequency = result.data.event.settings.notificationFrequency;
			}
			let data: IEvent = {
				// @ts-expect-error
				_id: result.data?.event._id,
				// @ts-expect-error
				title: result.data?.event.title,
				// @ts-expect-error
				description: result.data?.event.description,
				// @ts-expect-error
				isHost: result.data?.attendeeInfo?.isHost,
				//@ts-expect-error
				canPost: result.data?.canPost,
				//@ts-expect-error
				muted: result.data?.attendeeInfo?.muted,
				// @ts-expect-error
				isActive: result.data?.isActive,
				notificationFrequency: _frequency,
				archived: _archived,
			};
			return data;
		}
	}

	// POSTS
	const {
		data: postsData,
		isLoading: postsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery<any>({
		queryKey: ["posts", eventId],
		queryFn: ({ pageParam = 1 }) => getPosts({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.hasNextPage ? allPages.length + 1 : false;
		},
	});
	useEffect(() => {
		if (postsData) {
			let posts = postsData.pages.flat()[0].posts as any[];
			setPosts(posts);
		}
	}, [postsData]);
	async function getPosts({ pageParam = 1 }) {
		const result = await postApi.getPosts({ eventId, page: pageParam });
		if (!result.ok) {
			throw new Error(result.problem);
		}
		return {
			//@ts-expect-error
			posts: result.data.data,
			//@ts-expect-error
			hasNextPage: result.data.next,
		};
	}

	if (error) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					paddingHorizontal: 20,
				}}>
				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: Fonts.title.fontSize,
						textAlign: "center",
					}}>
					{JSON.stringify(error)}
				</Text>
			</View>
		);
	} else if (isLoading) {
		return (
			<PartyLoading
				variant="white_backdrop"
				message={"Gathering who's at the party"}
			/>
		);
	} else {
		return (
			<SafeAreaView style={{ flex: 1, bottom: -30 }}>
				<PartyHeader
					title={data.title}
					eventId={eventId}
					name={data.title}
					isHost={data.isHost}
				/>
				<ActivateParty
					isActive={data.isActive}
					eventId={eventId}
					isHost={data.isHost}
				/>
				<TakePhoto eventId={eventId} canPost={data.canPost} />
				<ScreenWrapper
					onRefresh={refetch}
					loading={false}
					scrollEnabled={true}
					onBottomScroll={() => {
						if (hasNextPage) {
							fetchNextPage();
						}
					}}
					bottomLoading={isFetchingNextPage}>
					<>
						{justCreated ? (
							<View>
								<Text
									style={{
										textAlign: "center",
										paddingVertical: 10,
										fontFamily: Fonts.title.fontFamily,
										fontSize: Fonts.title.fontSize,
									}}>
									Welcome to {data.title || "Your Party"}
								</Text>
								<Text
									style={{
										textAlign: "left",
										paddingVertical: 10,
										paddingHorizontal: 10,
										fontFamily: Fonts.body.fontFamily,
										fontSize: Fonts.body.fontSize,
									}}>
									{data.description || "Your Party Description"}
								</Text>
								<Text
									style={{
										textAlign: "center",
										paddingVertical: 10,
										paddingHorizontal: 40,
										fontFamily: Fonts.body.fontFamily,
										fontSize: Fonts.body.fontSize,
									}}>
									(You can change the name at anytime from the settings)
								</Text>
							</View>
						) : (
							<></>
						)}
						{postsLoading ? (
							<View
								style={{
									position: "absolute",
									left: 0,
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
								{!postsData ? (
									<EmptyPartyMessage isHost={data.isHost} />
								) : (
									<>
										<FlatList
											data={posts}
											keyExtractor={(item) => item._id}
											renderItem={({ item, index }) => {
												return (
													<TouchableOpacity
														delayPressIn={500}
														onPress={() => {
															console.log("Clicked");
															navigation.navigate("Post", {
																postId: item._id,
																eventId: eventId,
																page: page,
															});
														}}>
														<Photo
															postId={item._id}
															image={item.src}
															caption={item.caption}
															owner={{
																name: item.user.name,
																picture: item.user.src,
																id: item.user._id,
															}}
															date={item.createdAt}
															likes={item.likes || 0}
															isLiked={item.isLiked}
															comments={item.comments || 0}
															refresh={refetch}
														/>
													</TouchableOpacity>
												);
											}}
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
															Getting More Pictures... 🖼
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
				</ScreenWrapper>
			</SafeAreaView>
		);
	}
}
// const [showHint1, setShowHint1] = useState(false);
// function queryTipState() {
// 	AsyncStorage.getItem("@10Min_Tip").then((result) => {
// 		if (result === null) {
// 			// if not found
// 			setShowHint1(true);
// 		}
// 	});
// }
// useEffect(() => {
// 	queryTipState();
// }, []);
// async function hideHint1() {
// 	let result = await AsyncStorage.setItem("@10Min_Tip", "true");
// }
// {showHint1 ? (
// 	<View
// 		style={{
// 			position: "absolute",
// 			bottom: 100,
// 			left: 20,
// 			right: 20,
// 			zIndex: 90,

// 			backgroundColor: Colors.background,
// 			...GlobalStyles.Container,
// 			...GlobalStyles.modalShadow,
// 		}}>
// 		<Text
// 			style={{
// 				fontFamily: Fonts.body.fontFamily,
// 				fontSize: Fonts.body.fontSize,
// 				textAlign: "center",
// 			}}>
// 			Photos take 10 minutes to develop!
// 		</Text>
// 		<TouchableOpacity
// 			onPress={() => hideHint1()}
// 			style={{
// 				marginTop: 25,
// 				...ButtonStyles.button,
// 				...ButtonStyles.primary,
// 			}}>
// 			<Text
// 				style={{
// 					...ButtonStyles.buttonText,
// 				}}>
// 				Got it!
// 			</Text>
// 		</TouchableOpacity>
// 	</View>
// ) : (
// 	<></>
// )}
