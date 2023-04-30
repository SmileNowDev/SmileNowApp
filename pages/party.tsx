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

export default function PartyPage({ route, navigation }) {
	const { eventId } = route.params;
	const [refreshing, setRefreshing] = useState(false);
	const [canPost, setCanPost] = useState(false);
	const [name, setName] = useState("");
	const [posts, setPosts] = useState([]);

	async function getPosts() {
		const result = await postApi.getPosts({ eventId, page: 1 });
		console.log("data: ", result.data);
		if (result.ok) {
			//@ts-expect-error
			setPosts(result.data);
		}
	}

	async function getEvent() {
		const result = await eventApi.getEvent({ eventId });
		if (result.ok) {
			// @ts-expect-error
			setName(result.data.event.title);
			// @ts-expect-error
			setCanPost(result.data.canPost);
		}
	}
	function onRefresh() {
		setRefreshing(true);
		getEvent();
		getPosts();
		setRefreshing(false);
	}
	useEffect(() => {
		getPosts();
		getEvent();
	}, [eventId]);
	const example = {
		__v: 0,
		_id: "644e201b186318238334ab45",
		caption: "Eyyyyy",
		createdAt: "2023-04-30T08:00:27.776Z",
		event: "644e03f57652a02e8555681a",
		updatedAt: "2023-04-30T08:00:27.776Z",
		user: {
			__v: 0,
			_id: "644df848a4b583b8c90f88d2",
			bio: "Add a bio...",
			createdAt: "2023-04-30T05:10:32.319Z",
			expoNotificationToken: "ExponentPushToken[3rdlrUHzjJMyai6BATw_Fo]",
			name: "Sam",
			password: "$2b$10$F5Fs6zwB0hBp73xnUsdCYugIKsflG5lrxSJAaCA1Vqq2G80LxjfxG",
			phone: "1241231234",
			updatedAt: "2023-04-30T08:07:06.821Z",
			username: "Sam",
		},
	};
	return (
		<SafeAreaView>
			<PartyHeader title={name} eventId={eventId} name={name} />
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
							style={{ ...ButtonStyles.buttonText, color: Colors.background }}>
							Take a Photo!
						</Text>
					</TouchableOpacity>
				</View>
			) : null}
			<ScrollView
				style={{ width: "100%", padding: 10 }}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}>
				{posts.map(function (photo: any, index) {
					return (
						<TouchableOpacity
							onPress={() => {
								navigation.navigate("Post", { postId: photo._id });
							}}>
							<Photo
								postId={photo._id}
								image={photo.src}
								caption={photo.caption}
								owner={{ name: photo.user.name, picture: photo.user.picture }}
								date={photo.updatedAt}
								likes={photo.likes || 0}
								isLiked={photo.isLiked || false}
								comments={photo.comments || 0}
								refresh={onRefresh}
							/>
						</TouchableOpacity>
					);
				})}
				<View style={{ height: Dim.height / 2 }} />
			</ScrollView>
			{/* header that lets you access party details */}
			{/* list of pictures */}
			{/* if they can, let them take a photo */}
		</SafeAreaView>
	);
}
