import React, { useRef, useState } from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
	Platform,
	Alert,
} from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
import likeApi from "../api/interaction/like";
import Avatar from "./avatar";
import DefaultOptions from "./defaultOptions";
const { width, height } = Dimensions.get("window");
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

export interface PhotoProps {
	postId: string;
	image: string;
	caption: string;
	owner: {
		picture: string;
		name: string;
		id: string;
	};
	date: string;
	likes: number;
	isLiked: boolean;
	comments: number;
	refresh: () => void;
}
export default function Photo({
	postId,
	image,
	caption,
	owner,
	date,
	likes,
	isLiked,
	comments,
	refresh,
}: PhotoProps) {
	const [liked, setLiked] = useState(isLiked ? true : false);
	function handleOpen() {
		console.log("open");
	}
	const imageToSave = useRef();

	async function handleLike() {
		if (!liked) {
			const result = await likeApi.create({ postId });
			if (result.ok) {
				setLiked(true);
			}
		} else {
			const result = await likeApi.deleteLike({ postId });
			if (result.ok) {
				setLiked(false);
			}
		}
		refresh();
	}

	const downloadImage = async (index) => {
		try {
			// react-native-view-shot caputures component
			const uri = await captureRef(imageToSave, {
				format: "png",
				quality: 1,
			});

			// cameraroll saves image
			const image = MediaLibrary.saveToLibraryAsync(uri);
			if (image) {
				Alert.alert(
					"Image saved",
					"Successfully saved image to your gallery.",
					[{ text: "OK", onPress: () => {} }],
					{ cancelable: false }
				);
			}
		} catch (error) {
			console.log("error", error);
		}
	};
	return (
		<>
			<View style={styles.photo}>
				<View ref={imageToSave} style={{ position: "relative" }}>
					<Image
						source={{ uri: image }}
						style={{ height: width - 40, width: width - 40 }}
					/>
					<Text
						style={{
							position: "absolute",
							bottom: 5,
							right: 5,
							padding: 5,
							fontFamily: "Exo_700Bold",
							color: "white",
							textShadowColor: "black",
							textShadowOffset: { width: 1, height: 1 },
							textShadowRadius: 5,
						}}
					>
						Smile Now
					</Text>
				</View>
				<View style={{ minHeight: 50 }}>
					<Text
						style={{
							marginTop: 10,
							fontFamily: Fonts.handWriting.fontFamily,
							fontSize: Fonts.handWriting.fontSize,
						}}
					>
						{caption}
					</Text>
					<View style={styles.footer}>
						<View style={styles.user}>
							<Avatar pic={owner.picture} size={25} id={owner.id} />

							<Text
								style={{
									fontFamily: Fonts.handWriting.fontFamily,
								}}
							>
								{owner.name}
							</Text>
						</View>
						<View style={styles.reactionContainer}>
							<TouchableOpacity style={styles.reaction} onPress={handleLike}>
								<Icon
									name='heart'
									type='Ion'
									size={25}
									color={liked ? Colors.primary : Colors.textSecondary}
								/>
								<Text
									style={{ fontFamily: Fonts.body.fontFamily, fontSize: 20 }}
								>
									{likes}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.reaction} disabled>
								<Icon name='message' size={25} color={Colors.textSecondary} />
								<Text
									style={{ fontFamily: Fonts.body.fontFamily, fontSize: 20 }}
								>
									{comments}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.reaction} onPress={downloadImage}>
								<Icon
									name='share'
									size={25}
									color={Colors.textSecondary}
									type={"Feather"}
								/>
							</TouchableOpacity>
							<DefaultOptions type={"post"} id={postId} size={25} />
						</View>
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	photo: {
		backgroundColor: Colors.background,
		borderColor: Colors.border,
		borderWidth: 1,
		borderStyle: "solid",
		padding: 10,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 6,
		elevation: 6,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		marginBottom: 20,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 10,
	},
	user: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	reaction: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 5,
	},
	reactionContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
	},
	optionButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		padding: 16,
		gap: 10,
		backgroundColor: Colors.foreground,
	},
});
