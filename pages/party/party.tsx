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

export default function PartyPage({ route, navigation }) {
	const { eventId, justCreated } = route.params;

	const [polaroidLooping, setPolaroidLooping] = useState(true); // start animation right away
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [isActive, setIsActive] = useState(true);

	const { isLoading, error, data, refetch } = useQuery<any>({
		queryKey: ["event", eventId],
		queryFn: getEvent,
	});
	async function getEvent() {
		const result = await eventApi.getEvent({ eventId });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			console.log(result.data);
			return result.data;
		}
	}
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

	useEffect(() => {
		const timer = setTimeout(() => {
			setPolaroidLooping(false);
		}, 4000);
		return () => clearTimeout(timer);
	}, []);
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
	if (isLoading || polaroidLooping) {
		return (
			<TouchableOpacity
				style={{ height: Dim.height }}
				onPress={() => setPolaroidLooping(false)}>
				<PartyLoading />
			</TouchableOpacity>
		);
	} else {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<PartyHeader
					title={data.title}
					eventId={data.eventId}
					name={data.name}
					isHost={data.isHost}
				/>
				<ActivateParty
					isActive={isActive}
					setIsActive={setIsActive}
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
									Welcome to {data.name}
								</Text>
								{/* <Text
									style={{
										textAlign: "left",
										paddingVertical: 10,
										paddingHorizontal: 10,
										fontFamily: Fonts.body.fontFamily,
										fontSize: Fonts.body.fontSize,
									}}>
									{bio}
								</Text> */}
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
						{postsData.pages.flat().length === 0 ? (
							<EmptyPartyMessage isHost={data.isHost} />
						) : (
							<>
								<FlatList
									data={postsData.pages.flat()}
									keyExtractor={(item) => item._id}
									renderItem={({ item, index }) => {
										return (
											<TouchableWithoutFeedback
												key={item._id}
												onPress={() => {
													navigation.navigate("Post", { postId: item._id });
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
