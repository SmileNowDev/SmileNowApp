import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Dim } from "../../../styles/styles";
import { Colors, Fonts } from "../../../styles/theme";
import { Text } from "../../SmileNowUI";

export default function NotificationFrequencyButton({
	mode,
	notificationFrequency,
	setNotificationFrequency,
	color,
	title,
	icon,
	subtext,
	disabled,
}) {
	return (
		<TouchableOpacity
			disabled={disabled}
			onPress={() => {
				setNotificationFrequency(mode);
			}}
			style={{
				...styles.frequencyOption,
				backgroundColor:
					notificationFrequency === mode ? color + "20" : "transparent",
				borderColor: notificationFrequency === mode ? color : Colors.border,
			}}>
			{icon}
			<Text
				style={{
					...styles.frequencyOptionText,
					color:
						notificationFrequency === mode ? Colors.text : Colors.textSecondary,
				}}>
				{title}
			</Text>
			<Text style={styles.frequencyOptionSubtext}>{subtext}</Text>
		</TouchableOpacity>
	);
}
const styles = StyleSheet.create({
	frequencyContainer: {
		gap: 5,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	frequencyOption: {
		width: Dim.width / 3 - 10,
		height: Dim.width / 3 - 10,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		borderWidth: 1,
		borderColor: Colors.textSecondary,
		borderRadius: 10,
		padding: 3,
	},
	frequencyOptionText: {
		marginTop: 10,
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.body.fontSize,
		color: Colors.textSecondary,
	},
	frequencyOptionSubtext: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.small.fontSize,
		color: Colors.textSecondary,
		textAlign: "center",
		width: Dim.width / 3 - 30,
	},
});
