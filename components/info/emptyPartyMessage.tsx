import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import Icon from "../icons";

export default function EmptyPartyMessage({ isHost }: { isHost: boolean }) {
	if (isHost) {
		return (
			<View style={styles.container}>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
					}}>
					Let's get this party started!
				</Text>
				<View style={styles.step}>
					<Icon
						name="person-add-alt-1"
						size={25}
						color={Colors.textSecondary}
					/>
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
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
					}}>
					This party is just started!
				</Text>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}>
					Who's going to take the first picture?
				</Text>
			</View>
		);
	}
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
