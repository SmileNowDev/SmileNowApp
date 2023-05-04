import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
export default function WelcomeMessage() {
	return (
		<View style={{ padding: 10 }}>
			<View style={styles.container}>
				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: Fonts.title.fontSize,
					}}>
					Welcome to Smile Now!
				</Text>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
					}}>
					Here's how it all works:
				</Text>
				<View style={styles.stepsContainer}>
					<View style={styles.step}>
						<Text
							style={{
								fontFamily: Fonts.button.fontFamily,
								fontSize: Fonts.button.fontSize,
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
								...styles.description,
								color: Colors.textSecondary,
								marginLeft: 25,
							}}>
							We send notifications to people one at a time
						</Text>
					</View>
					<View style={styles.step}>
						<Text
							style={{
								fontFamily: Fonts.button.fontFamily,
								fontSize: Fonts.button.fontSize,
							}}>
							4.
						</Text>
						<Text style={styles.description}>
							Never forget to capture a moment again!
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.Container,
		
		marginTop: 50,
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
		alignItems: "flex-start",
		justifyContent: "flex-start",
		gap: 10,
	},
	description: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.body.fontSize,
		color: Colors.text,

		flex: 1,
	},
});
