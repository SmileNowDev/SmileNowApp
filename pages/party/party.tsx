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
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ActivateParty from "../../components/party/activateParty";
import TakePhoto from "../../components/party/takePhoto";
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
	const { eventId, justCreated } = route.params;

	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);

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
			// console.log("==============");
			// //@ts-expect-error
			// console.log("getting event: ", result.data.event.title);
			// console.log(result.data);
			// console.log("==============");
			console.log(result.data);
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
				// @ts-expect-error
				notificationFrequency: result.data?.event.notificationFrequency,
				// @ts-expect-error
				archived: result.data?.event.archived,
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
		queryKey: ["posts", eventId, page],
		queryFn: getPosts,
		getNextPageParam: (lastPage) => {
			return hasNextPage ? page + 1 : undefined;
		},
	});

	async function getPosts({ pageParam = 1 }) {
		setPage(pageParam);
		const result = await postApi.getPosts({ eventId, page: pageParam });
		if (!result.ok) {
			throw new Error(result.problem);
		}
		return result.data;
	}

	function onRefresh() {
		setRefreshing(true);
		refetch();
		setRefreshing(false);
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
	}
	if (isLoading) {
		return (
			<View
				style={{
					height: Dim.height,
					alignItems: "center",
					justifyContent: "center",
				}}>
				<ActivityIndicator size={"large"} color={Colors.primary} />
			</View>
		);
	} else {
		return (
			<SafeAreaView style={{ flex: 1 }}>
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
					onRefresh={onRefresh}
					scrollEnabled={true}
					loading={postsLoading}
					onBottomScroll={() => {
						if (hasNextPage) {
							fetchNextPage();
						}
					}}
					bottomLoading={isFetchingNextPage}>
					<>
						{justCreated && postsData.pages.flat().length === 0 ? (
							<View>
								<Text
									style={{
										textAlign: "center",
										paddingVertical: 10,
										fontFamily: Fonts.title.fontFamily,
										fontSize: Fonts.title.fontSize,
									}}>
									Welcome to {data.title}
								</Text>
								<Text
									style={{
										textAlign: "left",
										paddingVertical: 10,
										paddingHorizontal: 10,
										fontFamily: Fonts.body.fontFamily,
										fontSize: Fonts.body.fontSize,
									}}>
									{data.description}
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
						{postsData?.pages.flat().length === 0 ? (
							<EmptyPartyMessage isHost={data.isHost} />
						) : (
							<>
								<FlatList
									data={postsData?.pages.flat()}
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
													refresh={onRefresh}
													delay={index}
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
