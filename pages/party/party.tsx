import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	FlatList,
	TouchableWithoutFeedback,
} from "react-native";
import PartyHeader from "../../components/layout/partyHeader";
import Photo from "../../components/post/photo";
import { Fonts } from "../../styles/theme";
import { Dim } from "../../styles/styles";
import eventApi from "../../api/post/event";
import postApi from "../../api/post/post";
import ScreenWrapper from "../../components/core/screenWrapper";
import EmptyPartyMessage from "../../components/info/emptyPartyMessage";
import PartyLoading from "../../components/party/partyLoading";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ActivateParty from "../../components/party/activateParty";
import TakePhoto from "../../components/party/takePhoto";
import { useIsFocused } from "@react-navigation/native";
import PostingIndicator from "../../components/party/postingIndicator";
import NewPosts from "../../components/party/newPosts";
import { trackEvent } from "@aptabase/react-native";
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
	const { eventId, justCreated, posting = true } = route.params;
	const [newPosts, setNewPosts] = useState([]);
	const [posts, setPosts] = useState([]);
	const [donePosting, setDonePosting] = useState(false);
	useEffect(() => {
		if (isFocused) {
			// console.log({ postsData });
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
		if (postsData !== undefined) {
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
				{data.isActive ? (
					<TakePhoto eventId={eventId} canPost={data.canPost} />
				) : (
					<></>
				)}
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
						{postsLoading ? (
							<View
								style={{
									position: "absolute",
									left: 0,
									top: 0,
									bottom: 0,
									right: 0,
									flex: 1,
									height: Dim.height / 2,
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
								{!posts.length ? (
									<EmptyPartyMessage isHost={data.isHost} />
								) : (
									<>
										<PostingIndicator
											posting={posting}
											donePosting={donePosting}
										/>
										<NewPosts
											posts={newPosts}
											doneLoading={false}
											eventId={eventId}
										/>
										<FlatList
											data={posts}
											keyExtractor={(item) => item._id}
											renderItem={({ item, index }) => {
												return (
													<TouchableWithoutFeedback
														delayPressIn={500}
														onPress={() => {
															trackEvent("viewPost", {
																location: "party",
															});
															navigation.navigate("Post", {
																postId: item._id,
																eventId: eventId,
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
													</TouchableWithoutFeedback>
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
