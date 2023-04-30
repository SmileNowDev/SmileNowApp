import React from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Dimensions,
} from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
const { width, height } = Dimensions.get("window");
interface PhotoProps {
	image: string;
	caption: string;
	owner: {
		picture: string;
		name: string;
	};
	date: string;
	likes: number;
	isLiked: boolean;
	comments: number;
}
export default function Photo({
	image,
	caption,
	owner,
	date,
	likes,
	isLiked,
	comments,
}) {
	function handleOpen() {
		console.log("open");
	}
	function handleLike() {
		console.log("like");
	}
	function handleComment() {
		console.log("comment");
	}
	return (
		<TouchableOpacity style={styles.photo} onPress={() => handleOpen()}>
			<Image
				source={{ uri: image }}
				style={{ height: width - 40, width: width - 40 }}
			/>
			<View style={{ minHeight: 50 }}>
				<Text
					style={{
						marginTop: 10,
						fontFamily: Fonts.handWriting.fontFamily,
						fontSize: Fonts.handWriting.fontSize,
					}}>
					{caption}
				</Text>
				<View style={styles.footer}>
					<View style={styles.user}>
						<Image
							source={{ uri: owner.image }}
							style={{
								height: 20,
								width: 20,
								borderRadius: 10,
								backgroundColor: "pink",
							}}
						/>
						<Text
							style={{
								fontFamily: Fonts.handWriting.fontFamily,
							}}>
							{owner}
						</Text>
					</View>
					<View style={styles.reactionContainer}>
						<TouchableOpacity
							style={styles.reaction}
							onPress={() => handleLike()}>
							<Icon
								name="heart"
								type="Ion"
								size={20}
								color={isLiked ? Colors.primary : Colors.textSecondary}
							/>
							<Text style={{ fontFamily: Fonts.body.fontFamily }}>{likes}</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.reaction}
							onPress={() => handleComment()}>
							<Icon name="message" size={20} color={Colors.textSecondary} />
							<Text style={{ fontFamily: Fonts.body.fontFamily }}>
								{comments}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</TouchableOpacity>
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
});
