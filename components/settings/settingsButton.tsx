import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import { Text } from "../SmileNowUI";
type SettingsButtonProps = {
	icon: React.ReactNode;
	text: string;
	onPress: () => void;
	rightElement?: React.ReactNode;
};
export default function SettingButton({
	icon,
	text,
	onPress,
	rightElement,
}: SettingsButtonProps) {
	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.settingButton}>
				{icon && icon}
				<View style={styles.textContainer}>
					<Text style={styles.text}>{text}</Text>
				</View>
				{rightElement ? (
					<View style={styles.rightElementContainer}>{rightElement}</View>
				) : null}
			</View>
		</TouchableOpacity>
	);
}
const styles = StyleSheet.create({
	settingButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
		gap: 10,
		backgroundColor: Colors.foreground,
		borderWidth: 1,
		borderColor: Colors.border,
		borderStyle: "solid",
		marginVertical: 5,
		marginHorizontal: 10,
		borderRadius: 10,
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.125,
		shadowRadius: 3,
		elevation: 1,
	},

	textContainer: {
		flex: 1,
	},
	text: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.body.fontSize,
		color: Colors.text,
	},
	rightElementContainer: {},
});
