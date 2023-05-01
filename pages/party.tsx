import React, { useState, useEffect } from "react";
import {
	RefreshControl,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import PartyHeader from "../components/partyHeader";
import Photo from "../components/photo";
import Icon from "../components/icons";
import { Colors } from "../styles/theme";
import { ButtonStyles, Dim } from "../styles/styles";
import eventApi from "../api/post/event";
import postApi from "../api/post/post";
import ScreenWrapper from "../components/core/screenWrapper";

export default function PartyPage({ route, navigation }) {
	const { eventId } = route.params;
	const [canPost, setCanPost] = useState(false);
	const [name, setName] = useState("");
	const [posts, setPosts] = useState([]);
	const [isHost, setIsHost] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [page, setPage] = useState(1); // Add this state
	const [hasMore, setHasMore] = useState(true); // Add this state
	const [loading, setLoading] = useState(false); // Add this state
	const [bottomLoading, setBottomLoading] = useState(false);

	async function getPosts() {
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
	}
	function onRefresh() {
		setRefreshing(true);
		getEvent();
		getPosts();
		setRefreshing(false);
	}
	useEffect(() => {
		setLoading(true);
		getPosts();
		getEvent();
		setLoading(false);
	}, [eventId]);

	return (
		<SafeAreaView>
			<PartyHeader title={name} eventId={eventId} name={name} isHost={isHost} />
			{canPost ? (
				<View
					style={{
						position: "absolute",
						bottom: 100,
						zIndex: 10,
						left: 20,
						right: 20,
					}}
				>
					<TouchableOpacity
						onPress={() => navigation.navigate("Camera", { eventId })}
						style={{ ...ButtonStyles.buttonLarge, ...ButtonStyles.primary }}
					>
						<Icon
							name='camera'
							size={30}
							type='Feather'
							color={Colors.background}
						/>
						<Text
							style={{ ...ButtonStyles.buttonText, color: Colors.background }}
						>
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
				bottomLoading={bottomLoading}
			>
				{posts.map(function (photo: any, index) {
					return (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("Post", { postId: photo._id });
							}}
						>
							<Photo
								postId={photo._id}
								image={photo.src}
								caption={photo.caption}
								owner={{
									name: photo.user.name,
									picture: photo.user.src,
									id: photo.user._id,
								}}
								date={photo.updatedAt}
								likes={photo.likes || 0}
								isLiked={photo.isLiked}
								comments={photo.comments || 0}
								refresh={onRefresh}
							/>
						</TouchableOpacity>
					);
				})}
				<View style={{ height: Dim.height / 2 }} />
			</ScreenWrapper>
			{/* header that lets you access party details */}
			{/* list of pictures */}
			{/* if they can, let them take a photo */}
		</SafeAreaView>
	);
}
