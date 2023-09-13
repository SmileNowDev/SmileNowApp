import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, Alert } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import Icon from "../core/icons";
// @ts-expect-error
import logo from "../../assets/logo_color.png";
import AnimatedLottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "../SmileNowUI/button";
export default function EmptyPartyMessage({ isHost }: { isHost: boolean }) {
	const [showTutorials, setShowTutorials] = useState(false);
	useEffect(() => {
		AsyncStorage.getItem("showPartyTutorials").then((value) => {
			if (value) setShowTutorials(true);
			else setShowTutorials(false);
		});
	}, []);
	async function handleDontShowAgain() {
		setShowTutorials(false);
		await AsyncStorage.setItem("showPartyTutorial", "false");
		setShowTutorials(false);
		Alert.alert(
			"We won't show you this again",
			"Go to settings to change this"
		);
	}

	if (isHost && showTutorials) {
		return (
			<>
				<View style={styles.container}>
					<View
						style={{
							alignItems: "center",
							gap: 20,
							marginVertical: 20,
						}}>
						<Image source={logo} style={{ width: 60, height: 60 }} />

						<Text
							style={{
								fontFamily: Fonts.subTitle.fontFamily,
								fontSize: Fonts.subTitle.fontSize,
							}}>
							Welcome to your party!
						</Text>
					</View>
					<View style={styles.step}>
						<Icon name="people" size={25} color={Colors.textSecondary} />
						<Text
							style={{
								fontFamily: Fonts.body.fontFamily,
								fontSize: Fonts.body.fontSize,
							}}>
							See Your Attendees
						</Text>
					</View>
					<View style={styles.step}>
						<Icon name="qr-code" size={25} color={Colors.textSecondary} />
						<Text
							style={{
								fontFamily: Fonts.body.fontFamily,
								fontSize: Fonts.body.fontSize,
							}}>
							Invite your friends to join
						</Text>
					</View>
					<View style={styles.step}>
						<Icon
							name="settings"
							type="Feather"
							size={25}
							color={Colors.textSecondary}
						/>
						<Text
							style={{
								fontFamily: Fonts.body.fontFamily,
								fontSize: Fonts.body.fontSize,
							}}>
							Edit the name or notification settings
						</Text>
					</View>
					<Button
						variant={"link"}
						style={{
							marginTop: 20,
						}}
						onPress={() => {
							handleDontShowAgain();
						}}>
						Don't Show Again
					</Button>
				</View>
			</>
		);
	} else {
		return (
			<View style={styles.container}>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
						textAlign: "center",
					}}>
					This party is just getting started!
				</Text>
				<AnimatedLottieView
					source={require("../../assets/animations/no-photos.json")}
					autoPlay
					loop
					style={{ width: 200, height: 200 }}
				/>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						textAlign: "center",
					}}>
					Who's going to take the first picture?
				</Text>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		...GlobalStyles.shadow,
		backgroundColor: Colors.background,
		marginTop: 50,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 20,
		borderRadius: 20,
		paddingHorizontal: 20,
	},
	stepsContainer: {
		marginTop: 20,
		width: "100%",
		display: "flex",
		overflow: "hidden",
		gap: 10,
	},

	step: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start",
		gap: 10,
		marginTop: 20,
	},
	description: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.body.fontSize,
		color: Colors.text,

		flex: 1,
	},
});
