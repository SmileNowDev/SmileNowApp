import React, { useState } from "react";
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
const { width, height } = Dimensions.get("window");
export default function PartyPage({ navigation }) {
	const [invitesVisible, setInvitesVisible] = useState(false);
	const [detailsVisible, setDetailsVisible] = useState(false);
	const [canPost, setCanPost] = useState(true);
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
	return (
		<SafeAreaView>
			<PartyHeader
				title={"Party"}
				navigation={navigation}
				setInvitesVisible={setInvitesVisible}
				setDetailsVisible={setDetailsVisible}
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
						onPress={() => navigation.navigate("Camera")}
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
				{testPhotos.map((photo) => (
					<Photo
						image={photo.image}
						caption={photo.caption}
						owner={photo.owner}
						date={photo.date}
						likes={photo.likes}
						isLiked={photo.isLiked}
						comments={photo.comments}
					/>
				))}
				<View style={{ height: height / 2 }} />
			</ScrollView>
			{/* header that lets you access party details */}
			{/* list of pictures */}
			{/* if they can, let them take a photo */}
		</SafeAreaView>
	);
}
