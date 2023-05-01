import React from "react";

import {
	View,
	Text,
	SafeAreaView,
	Image,
	StyleSheet,
	TouchableOpacity,
	Linking,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import Icon from "./icons";
import { ButtonStyles } from "../styles/styles";
import * as SMS from "expo-sms";

interface ContactCardProps {
	name: string;
	id: string;
	number: string;
	initials: string;
}
export default function ContactCard({
	name,
	id,
	number,
	initials,
}: ContactCardProps) {
	// function invite() {
	// 	// TODO: this is not working
	// 	const message = `Hey!, join me on Smile Now - the fun app that makes taking party photos awesome! Download it here: [Link to Download the App]. Let's snap some cool photos together!"`;

	// 	const url = `sms:&body=${message}`;

	// 	Linking.openURL(url);
	// }

	const sendText = async () => {
		const { result } = await SMS.sendSMSAsync(
			[number],
			"Hello! I think you should definitely download this app! Smile Now offers the best event picture-taking experience. Check it out: https://smile.samschmitt.net"
			// {
			// 	attachments: {
			// 		uri: "../../assets/icon.png",
			// 		mimeType: "image/png",
			// 		filename: "quae.png",
			// 	},
			// }
		);
	};
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => sendText()}
			key={id}
		>
			<View
				style={{
					height: 40,
					width: 40,
					borderRadius: 20,
					backgroundColor: Colors.border,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize - 2,
						color: Colors.textSecondary,
					}}
				>
					{initials}
				</Text>
			</View>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}
				>
					{name}
				</Text>
			</View>
			<TouchableOpacity
				onPress={() => sendText()}
				style={{
					...ButtonStyles.buttonSmall,
					...ButtonStyles.primaryOutlined,
				}}
			>
				<Icon name='add' size={20} color={Colors.primary} />
				<Text
					style={{
						...ButtonStyles.buttonTextSmall,
						color: Colors.primary,
					}}
				>
					Invite
				</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 10,
		paddingVertical: 10,
	},
});
