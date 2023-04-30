import React, { useState } from "react";
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
import likeApi from "../api/interaction/like";
import Avatar from "./avatar";
const { width, height } = Dimensions.get("window");
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
	function handleComment() {
		console.log("comment");
	}
	return (
		<View style={styles.photo}>
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
						<Avatar pic={owner.picture} size={20} id={owner.id} />

						<Text
							style={{
								fontFamily: Fonts.handWriting.fontFamily,
							}}>
							{owner.name}
						</Text>
					</View>
					<View style={styles.reactionContainer}>
						<TouchableOpacity style={styles.reaction} onPress={handleLike}>
							<Icon
								name="heart"
								type="Ion"
								size={20}
								color={liked ? Colors.primary : Colors.textSecondary}
							/>
							<Text style={{ fontFamily: Fonts.body.fontFamily }}>{likes}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.reaction} disabled>
							<Icon name="message" size={20} color={Colors.textSecondary} />
							<Text style={{ fontFamily: Fonts.body.fontFamily }}>
								{comments}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
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
