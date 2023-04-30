import React from "react";

import {
	View,
	Text,
	SafeAreaView,
	Image,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";

export default function UserCard({
	profilePicture,
	name,
	username,
	id,
	onPress,
}) {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress}>
			<Image
				source={{ uri: profilePicture }}
				style={{ width: 40, height: 40, borderRadius: 20 }}
			/>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}>
					{name}
				</Text>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize - 2,
						color: Colors.textSecondary,
					}}>
					@{username}
				</Text>
			</View>
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
