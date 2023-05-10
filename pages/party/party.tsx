import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	FlatList,
	ActivityIndicator,
} from "react-native";
import PartyHeader from "../../components/layout/partyHeader";
import Photo from "../../components/post/photo";
import Icon from "../../components/core/icons";
import { Colors } from "../../styles/theme";
import { ButtonStyles, Dim } from "../../styles/styles";
import eventApi from "../../api/post/event";
import postApi from "../../api/post/post";
import ScreenWrapper from "../../components/core/screenWrapper";
import EmptyPartyMessage from "../../components/info/emptyPartyMessage";

export default function PartyPage({ route, navigation }) {
	const { eventId } = route.params;
	const [canPost, setCanPost] = useState(false);
	const [name, setName] = useState("");
	const [posts, setPosts] = useState([]);
	const [isHost, setIsHost] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [bottomLoading, setBottomLoading] = useState(false);

	async function getPosts() {
		setLoading(true);
		const result = await postApi.getPosts({ eventId, page: 1 });
		if (result.ok) {
			//@ts-expect-error
			setPosts(result.data);
		}
	}
	async function loadMoreEvents() {
		if (!hasMore) {
			return;
		}

		setBottomLoading(true);
		const nextPage = page + 1;
		const result = await postApi.getPosts({ eventId, page: nextPage });

		if (result.ok) {
			// @ts-expect-error
			if (result.data.length > 0) {
				//@ts-expect-error
				setPosts((prevEvents) => [...prevEvents, ...result.data]);
				setPage(nextPage);
			} else {
				setHasMore(false);
			}
		}

		setBottomLoading(false);
	}

	async function getEvent() {
		const result = await eventApi.getEvent({ eventId });
		if (result.ok) {
			// @ts-expect-error
			setName(result.data.event.title);
			// @ts-expect-error
			setCanPost(result.data.canPost);
			// @ts-expect-error
			setIsHost(result.data.isHost);
		}
		setLoading(false);
	}
	function onRefresh() {
		setRefreshing(true);
		getPosts();
		getEvent();
		setRefreshing(false);
	}
	useEffect(() => {
		getPosts();
		getEvent();
	}, [eventId]);
	if (loading) {
		return (
			<SafeAreaView>
				<PartyHeader
					title={name}
					eventId={eventId}
					name={name}
					isHost={isHost}
				/>
				<ActivityIndicator
					size={"large"}
					color={Colors.primary}
					style={{
						height: Dim.width - 20,
						width: Dim.width - 20,
						position: "absolute",
						top: (Dim.width - 20) / 2,
						zIndex: 100,
					}}
				/>
			</SafeAreaView>
		);
	} else {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<PartyHeader
					title={name}
					eventId={eventId}
					name={name}
					isHost={isHost}
				/>
				{canPost ? (
					<View
						style={{
							position: "absolute",
							bottom: 100,
							zIndex: 10,
							left: 20,
							right: 20,
						}}>
						<TouchableOpacity
							onPress={() => navigation.navigate("Camera", { eventId })}
							style={{ ...ButtonStyles.buttonLarge, ...ButtonStyles.primary }}>
							<Icon
								name="camera"
								size={30}
								type="Feather"
								color={Colors.background}
							/>
							<Text
								style={{
									...ButtonStyles.buttonText,
									color: Colors.background,
								}}>
								Take a Photo!
							</Text>
						</TouchableOpacity>
					</View>
				) : null}
				<ScreenWrapper
					onRefresh={onRefresh}
					scrollEnabled={true}
					loading={loading}
					onBottomScroll={loadMoreEvents}
					bottomLoading={bottomLoading}>
					<>
						{posts.length === 0 ? (
							<EmptyPartyMessage isHost={isHost} />
						) : (
							<>
								<FlatList
									data={posts}
									keyExtractor={(item) => item._id}
									renderItem={({ item }) => {
										return (
											<TouchableOpacity
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
												/>
											</TouchableOpacity>
										);
									}}
								/>

								<View style={{ height: Dim.height / 2 }} />
							</>
						)}
					</>
				</ScreenWrapper>
			</SafeAreaView>
		);
	}
}
