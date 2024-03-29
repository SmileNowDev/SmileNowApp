import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";
import likeApi from "../../api/interaction/like";
import Avatar from "../avatar";
import DefaultOptions from "../core/defaultOptions";

import ModalWrapper from "../core/modalWrapper";
import dayjs from "dayjs";
import DownloadPost from "./downloadPost";
import relativeTime from "dayjs/plugin/relativeTime";
import Polaroid from "./polaroid";
dayjs.extend(relativeTime);
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
	const [downloadModalVisible, setDownloadModalVisible] = useState(false);
	const [liked, setLiked] = useState(isLiked ? true : false);
	const [likesCount, setLikesCount] = useState(likes);

	async function handleLike() {
		if (!liked) {
			const result = await likeApi.create({ postId });
			if (result.ok) {
				setLiked(true);
				setLikesCount((p) => {
					let c = p;
					return c + 1;
				});
			}
		} else {
			const result = await likeApi.deleteLike({ postId });
			if (result.ok) {
				setLiked(false);
				setLikesCount((p) => {
					let c = p;
					return c - 1;
				});
			}
		}
		// refresh();
	}

	function handleEndZoom() {
		console.log("end zoom");
	}

	return (
		<>
			<View style={styles.photo}>
				<Polaroid imageUri={image} takenAt={date} postId={postId} />
				<View style={{ minHeight: 50, width: "100%" }}>
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
							<Avatar pic={owner.picture} size={35} id={owner.id} />
							<View
								style={{ flex: 1, overflow: "hidden", position: "relative" }}>
								<Text
									numberOfLines={1}
									style={{
										fontFamily: Fonts.button.fontFamily,
										fontSize: Fonts.button.fontSize,
										flex: 1,
										width: "100%",
									}}>
									{owner.name}
								</Text>
								<Text
									style={{
										fontFamily: Fonts.small.fontFamily,
										fontSize: Fonts.small.fontSize,
										color: Colors.textSecondary,
										textAlign: "left",
									}}>
									{dayjs(date).fromNow()}
								</Text>
							</View>
						</View>
						<View style={styles.reactionContainer}>
							<TouchableOpacity style={styles.reaction} onPress={handleLike}>
								<Icon
									name="heart"
									type="Ion"
									size={25}
									color={liked ? Colors.primary : Colors.textSecondary}
								/>
								<Text
									style={{ fontFamily: Fonts.body.fontFamily, fontSize: 20 }}>
									{likesCount}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.reaction} disabled>
								<Icon name="message" size={25} color={Colors.textSecondary} />
								<Text
									style={{ fontFamily: Fonts.body.fontFamily, fontSize: 20 }}>
									{comments}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.reaction}
								onPress={() => setDownloadModalVisible(true)}>
								<Icon
									name="download"
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

			<ModalWrapper
				visible={downloadModalVisible}
				setVisible={setDownloadModalVisible}
				fullHeight={false}>
				<DownloadPost
					image={image}
					caption={caption}
					date={date}
					setModalVisible={setDownloadModalVisible}
				/>
			</ModalWrapper>
		</>
	);
}

const styles = StyleSheet.create({
	photo: {
		backgroundColor: Colors.background,
		borderColor: Colors.border,
		borderRadius: 7.5,
		borderWidth: 1,
		borderStyle: "solid",
		alignItems: "center",
		padding: 10,
		paddingBottom: 10,
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 2,
		elevation: 2,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		marginTop: 10,
	},
	photoDownload: {
		backgroundColor: Colors.background,
		borderColor: Colors.border,
		borderWidth: 1,
		borderStyle: "solid",
		padding: 5,
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 2,
		elevation: 2,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		marginVertical: 10,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
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
		gap: 10,
		flex: 1,
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
	waterMarkText: {
		position: "absolute",
		bottom: 0,
		right: 0,
		padding: 5,
		fontFamily: "Exo_600SemiBold",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5,
		fontSize: 8,
	},
});
