import React, { useState, useEffect } from "react";
import {
	Dimensions,
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
import { ButtonStyles } from "../styles/styles";
import eventApi from "../api/post/event";
import postApi from "../api/post/post";

const { width, height } = Dimensions.get("window");
export default function PartyPage({ route, navigation }) {
	const { eventId } = route.params;
	const [canPost, setCanPost] = useState(false);
	const [name, setName] = useState("");
	const [posts, setPosts] = useState([]);
	const testPhotos = [
		{
			image:
				"https://fastly.picsum.photos/id/185/200/200.jpg?hmac=YNeKNCPhFVkjxUu5nB7ZP8UJVw_zYu3TPLI11_edSWc",
			caption: "This is a test caption",
			owner: "sally123",
			date: "2021-03-01",
			likes: 5,
			isLiked: true,
			comments: 3,
		},
		{
			image:
				"https://fastly.picsum.photos/id/676/200/200.jpg?hmac=hgeMQEIK4Mn27Q2oLRWjXo1rgxwTbk1CnJE954h_HyM",
			caption: "This is a test caption",
			owner: "sally123",
			date: "2021-03-01",
			likes: 5,
			isLiked: false,
			comments: 3,
		},
	];

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
			<ScrollView style={{ width: "100%", padding: 10 }}>
				{posts.map(function (photo: any, index) {
					return (
						<Photo
							image={photo.src}
							caption={photo.caption}
							owner={{ name: photo.user.name, picture: photo.user.picture }}
							date={photo.updatedAt}
							likes={photo.likes || 0}
							isLiked={photo.isLiked || false}
							comments={photo.comments || 0}
						/>
					);
				})}
				<View style={{ height: height / 2 }} />
			</ScrollView>
			{/* header that lets you access party details */}
			{/* list of pictures */}
			{/* if they can, let them take a photo */}
		</SafeAreaView>
	);
}
