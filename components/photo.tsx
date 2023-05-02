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
import ModalWrapper from "./core/modalWrapper";
import dayjs from "dayjs";

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
	function handleOpen() {
		console.log("open");
	}
	const imageToSave = useRef();
	const imageToSaveWithCaption = useRef();

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

	const downloadImage = async (ref: React.MutableRefObject<undefined>) => {
		try {
			// react-native-view-shot caputures component
			const uri = await captureRef(ref, {
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
							<Avatar pic={owner.picture} size={25} id={owner.id} />

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
									size={25}
									color={liked ? Colors.primary : Colors.textSecondary}
								/>
								<Text
									style={{ fontFamily: Fonts.body.fontFamily, fontSize: 20 }}>
									{likes}
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
				<View
					style={{
						height: "100%",
						paddingVertical: 20,
						display: "flex",
						flexDirection: "column",
					}}>
					{/* flex row */}
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}>
						<Text
							style={{
								fontFamily: Fonts.title.fontFamily,
								fontSize: Fonts.title.fontSize,
							}}>
							Download Options
						</Text>
						<TouchableOpacity onPress={() => setDownloadModalVisible(false)}>
							<Icon name="close" size={30} color={Colors.textSecondary} />
						</TouchableOpacity>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "flex-start",
							marginTop: 20,
							gap: 20,
							flex: 1,
						}}>
						<View
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								alignItems: "center",
								height: width / 2 + 100,
							}}>
							<View
								style={{
									...styles.photoDownload,
									shadowOpacity: 0,
									borderColor: "transparent",
									backgroundColor: "transparent",
								}}>
								<View
									style={{
										position: "relative",
										shadowOpacity: 0.25,
										shadowOffset: { width: 0, height: 4 },
										shadowRadius: 2,
										elevation: 2,
										shadowColor: "rgba(0, 0, 0, 0.25)",
									}}
									ref={imageToSave}>
									<Image
										source={{ uri: image }}
										style={{ height: width / 2 - 40, width: width / 2 - 40 }}
									/>
									<Text style={styles.waterMarkText}>Smile Now</Text>
								</View>
							</View>
							<TouchableOpacity
								onPress={() => downloadImage(imageToSave)}
								style={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									gap: 10,
								}}>
								<Text
									style={{
										fontFamily: Fonts.body.fontFamily,
										fontSize: Fonts.body.fontSize,
									}}>
									Photo Only
								</Text>
								<Icon name={"download"} type="Feather" size={30} />
							</TouchableOpacity>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "column",
								height: width / 2 + 100,
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<View style={styles.photoDownload} ref={imageToSaveWithCaption}>
								<View style={{ position: "relative" }}>
									<Image
										source={{ uri: image }}
										style={{
											height: width / 2 - 40,
											width: width / 2 - 40,
										}}
									/>
									<Text style={styles.waterMarkText}>Smile Now</Text>
								</View>
								<Text
									style={{
										fontFamily: Fonts.handWriting.fontFamily,
										fontSize: 11,
										paddingTop: 5,
										paddingHorizontal: 2,
										width: width / 2 - 40,
									}}>
									{caption}
								</Text>
								<Text
									style={{
										fontFamily: Fonts.body.fontFamily,
										fontSize: 8,
										color: Colors.textSecondary,
										paddingHorizontal: 2,
										width: width / 2 - 40,
										textAlign: "right",
									}}>
									{dayjs(date).format("YYYY-MM-DD  hh:mm")}
								</Text>
							</View>
							<TouchableOpacity
								onPress={() => downloadImage(imageToSaveWithCaption)}
								style={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									gap: 10,
								}}>
								<Text
									style={{
										fontFamily: Fonts.body.fontFamily,
										fontSize: Fonts.body.fontSize,
									}}>
									Photo + Caption
								</Text>
								<Icon name={"download"} type="Feather" size={30} />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ModalWrapper>
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
		shadowOpacity: 0.25,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 2,
		elevation: 2,
		shadowColor: "rgba(0, 0, 0, 0.25)",
		marginVertical: 10,
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
