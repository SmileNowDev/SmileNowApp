import React, { useContext } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import Icon from "../components/icons";
import Header from "../components/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Context } from "../providers/provider";
export default function Settings(params) {
	type SettingsButtonProps = {
		icon: React.ReactNode;
		text: string;
		onPress: () => void;
		rightElement?: React.ReactNode;
	};
	function SettingButton({
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
	const { setUserId, setLoggedIn } = useContext(Context);
	async function logout() {
		await AsyncStorage.removeItem("access-token");
		await AsyncStorage.removeItem("refresh-token");
		setUserId("");
		setLoggedIn(false);
		params.navigation.navigate("SignUp");
	}
	const buttons = [
		{
			icon: <Icon name="logout" type="MaterialCommunity" />,
			text: "Logout",
			onPress: () => logout(),
		},
	];
	return (
		<SafeAreaView>
			<Header goBack title={"Settings"} />
			{buttons.map((button) => (
				<SettingButton {...button} />
			))}
		</SafeAreaView>
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
