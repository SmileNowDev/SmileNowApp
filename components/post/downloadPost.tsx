import React, { useRef } from "react";
import { Image, TouchableOpacity, StyleSheet, View } from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";

import dayjs from "dayjs";
import { Dim } from "../../styles/styles";
import { downloadImage } from "../../utils/downloadView";
import { Text } from "../SmileNowUI";
import { trackEvent } from "@aptabase/react-native";
interface DownloadPostProps {
	image: string;
	caption: string;
	date: string;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function DownloadPost({
	image,
	caption,
	date,
	setModalVisible,
}: DownloadPostProps) {
	const imageToSave = useRef();
	const imageToSaveWithCaption = useRef();
	return (
		<View
			style={{
				height: "100%",
				paddingVertical: 20,
				display: "flex",
				flexDirection: "column",
			}}>
			{/* images to download  */}
			<View style={styles.imageOffScreen}>
				<View style={{ position: "relative" }} ref={imageToSave}>
					<Image
						source={{ uri: image }}
						style={{ height: Dim.width - 40, width: Dim.width - 40 }}
					/>
					<Text style={{ ...styles.waterMarkText, fontSize: 15 }}>
						Smile Now
					</Text>
				</View>
			</View>
			<View
				style={styles.imageWithCaptionOffScreen}
				ref={imageToSaveWithCaption}>
				<View style={{ position: "relative" }}>
					<Image
						source={{ uri: image }}
						style={{
							height: Dim.width - 40,
							width: Dim.width - 40,
						}}
					/>
					<Text style={{ ...styles.waterMarkText, fontSize: 15 }}>
						Smile Now
					</Text>
				</View>
				<Text
					style={{
						fontFamily: Fonts.handWriting.fontFamily,
						fontSize: 20,
						paddingVertical: 10,
						paddingHorizontal: 5,
						width: Dim.width - 40,
					}}>
					{caption}
				</Text>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: 12,
						color: Colors.textSecondary,
						paddingHorizontal: 10,
						width: "100%",
						textAlign: "right",
					}}>
					{dayjs(date).format("YYYY-MM-DD  hh:mm")}
				</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Text variant="title">Download Options</Text>
				<TouchableOpacity onPress={() => setModalVisible(false)}>
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
						height: Dim.width / 2 + 100,
					}}>
					<View
						style={{
							...styles.photoDownload,
							shadowOpacity: 0,
							borderColor: "transparent",
							backgroundColor: "transparent",
						}}>
						<TouchableOpacity
							onPress={() => downloadImage(imageToSave)}
							style={{
								position: "relative",
								shadowOpacity: 0.25,
								shadowOffset: { width: 0, height: 4 },
								shadowRadius: 2,
								elevation: 2,
								shadowColor: "rgba(0, 0, 0, 0.25)",
							}}>
							<Image
								source={{ uri: image }}
								style={{
									height: Dim.width / 2 - 40,
									width: Dim.width / 2 - 40,
								}}
							/>
							<Text style={styles.waterMarkText}>Smile Now</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						onPress={() => {
							trackEvent("Party_Action", {
								action_name: "Download Photo Only",
							});
							downloadImage(imageToSave);
						}}
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							gap: 10,
						}}>
						<Text>Photo Only</Text>
						<Icon name={"download"} type="Feather" size={30} />
					</TouchableOpacity>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						height: Dim.width / 2 + 100,
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<TouchableOpacity
						onPress={() => {
							trackEvent("Party_Action", {
								action_name: "Download Photo + Caption",
							});
							downloadImage(imageToSaveWithCaption);
						}}
						style={styles.photoDownload}>
						<View style={{ position: "relative" }}>
							<Image
								source={{ uri: image }}
								style={{
									height: Dim.width / 2 - 40,
									width: Dim.width / 2 - 40,
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
								width: Dim.width / 2 - 40,
							}}>
							{caption}
						</Text>
						<Text
							style={{
								fontFamily: Fonts.body.fontFamily,
								fontSize: 8,
								color: Colors.textSecondary,
								paddingHorizontal: 2,
								width: Dim.width / 2 - 40,
								textAlign: "right",
							}}>
							{dayjs(date).format("YYYY-MM-DD  hh:mm")}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => downloadImage(imageToSaveWithCaption)}
						style={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							gap: 10,
						}}>
						<Text>Photo + Caption</Text>
						<Icon name={"download"} type="Feather" size={30} />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
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

	waterMarkText: {
		position: "absolute",
		bottom: 0,
		right: 0,
		padding: 5,
		opacity: 0.75,
		fontFamily: "Exo_600SemiBold",
		color: "white",
		textShadowColor: "black",
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 5,
		fontSize: 8,
	},
	imageOffScreen: {
		position: "absolute",
		right: Dim.width * 5,
	},
	imageWithCaptionOffScreen: {
		position: "absolute",
		left: Dim.width * 5,
		backgroundColor: Colors.background,
		borderColor: Colors.border,
		borderWidth: 1,
		borderStyle: "solid",
		padding: 5,
		paddingTop: 10,
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
});
