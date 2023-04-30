import React from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import Header from "../components/header";
import Icon from "../components/icons";
export default function ProfilePage({ navigation }) {
	const user = {
		image: "blah",
		name: "Sally",
		userName: "sally123",
	};

	return (
		<SafeAreaView>
			<Header goBack title={"My Profile"} navigation={navigation} />
			<View
				style={{
					paddingTop: 30,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<View
					style={{
						height: 150,
						width: 150,
						borderRadius: 75,
						backgroundColor: Colors.primary,
						marginBottom: 10,
					}}></View>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.subTitle.fontSize,
					}}>
					{user.name}
				</Text>
				<Text
					style={{
						fontFamily: Fonts.button.fontFamily,
						fontSize: Fonts.button.fontSize,
						color: Colors.textSecondary,
					}}>
					@{user.userName}
				</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 5,
					marginVertical: 20,
				}}>
				<TouchableOpacity
					onPress={() => {}}
					style={{
						...styles.optionButton,
						backgroundColor: Colors.primaryLight,
					}}>
					<Icon name="share" type={"Feather"} size={30} />
					<Text>Share Profile</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {}}
					style={{
						...styles.optionButton,
						backgroundColor: Colors.secondaryLight,
					}}>
					<Icon name="edit" type={"Feather"} size={30} />
					<Text>Edit Profile</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {}}
					style={{ ...styles.optionButton, backgroundColor: Colors.border }}>
					<Icon name="settings" type={"Feather"} size={30} />
					<Text>Settings</Text>
				</TouchableOpacity>
			</View>

			{/* quick actions */}
			{/* my pictures */}
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	optionButton: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		width: 100,
		height: 100,
		borderRadius: 10,
		gap: 5,
	},
});
