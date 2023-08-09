import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Dim } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import AnimatedLottieView from "lottie-react-native";
import wave from "../../assets/animations/wave.json";
export default function WelcomeMessage() {
	return (
		<ScrollView style={{ paddingBottom: 150 }}>
			<View style={{ ...styles.container }}>
				<View
					style={{
						height: 100,
						width: "100%",
						position: "relative",
					}}>
					<AnimatedLottieView
						source={wave}
						autoPlay
						speed={1.5}
						loop
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: Dim.width,
							height: 200,
							marginTop: -25,
						}}
					/>
				</View>
				<Text
					style={{
						left: 0,
						right: 0,
						bottom: 0,
						textAlign: "center",
						zIndex: 2,
						fontFamily: Fonts.titleBold.fontFamily,
						fontSize: Fonts.titleBold.fontSize + 10,
						color: Colors.text,
					}}>
					Welcome!
				</Text>
				<Text
					style={{
						marginTop: -10,
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
						color: Colors.textSecondary,
					}}>
					Here's how it all works:
				</Text>
				<View style={styles.stepsContainer}>
					<View style={styles.step}>
						<Text
							style={{
								fontFamily: Fonts.button.fontFamily,
								fontSize: Fonts.button.fontSize,
								...styles.number,
								color: Colors.background,
								backgroundColor: Colors.primary,
							}}>
							1.
						</Text>
						<Text style={styles.description}>
							Create a party with just 1 click
						</Text>
					</View>
					<View style={styles.step}>
						<Text
							style={{
								fontFamily: Fonts.button.fontFamily,
								fontSize: Fonts.button.fontSize,
								...styles.number,
								color: Colors.background,
								backgroundColor: Colors.tertiary,
							}}>
							2.
						</Text>
						<Text style={styles.description}>Invite your friends to join</Text>
					</View>

					<View style={styles.step}>
						<Text
							style={{
								fontFamily: Fonts.button.fontFamily,
								fontSize: Fonts.button.fontSize,
								...styles.number,
								color: Colors.background,
								backgroundColor: Colors.secondary,
							}}>
							3.
						</Text>
						<Text style={styles.description}>
							When its your turn, get notified to take a photo
						</Text>
					</View>

					<View style={styles.step}>
						<Text
							style={{
								fontFamily: Fonts.button.fontFamily,
								fontSize: Fonts.button.fontSize,
								...styles.number,
								color: Colors.background,
								backgroundColor: Colors.success,
							}}>
							4.
						</Text>
						<Text
							style={{
								...styles.description,
							}}>
							Never forget to capture a moment again!
						</Text>
					</View>
				</View>
			</View>
			<View style={{ height: 100 }} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
		alignItems: "center",
		marginTop: 20,
		paddingBottom: 100,
	},
	stepsContainer: {
		width: "100%",
		display: "flex",
		overflow: "hidden",
		gap: 10,
		paddingVertical: 20,
		paddingHorizontal: 40,
	},

	step: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "flex-start",
		gap: 10,
		marginTop: 20,
	},
	description: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.body.fontSize + 2,
		textAlign: "center",
		color: "black",
		flex: 1,
	},
	number: {
		height: 40,
		width: 40,
		borderRadius: 20,
		overflow: "hidden",
		textAlign: "center",
		alignContent: "center",
		lineHeight: 40,
	},
});
