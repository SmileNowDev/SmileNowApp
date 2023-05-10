import React, { useContext } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import Icon from "../components/core/icons";
import Header from "../components/layout/header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Context } from "../providers/provider";
import authApi from "../api/user/auth";
export default function Settings({ navigation }) {
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
		navigation.navigate("SignUp");
	}
	async function deleteAccount() {
		const result = await authApi.deleteAccount();
		if (result.ok) {
			await logout();
		}
	}
	function handleConfirmDelete() {
		Alert.alert(
			"Are you sure you want to delete your account?",
			"This action is irreversible!",
			[
				{
					text: "Yes - Delete",
					onPress: () => deleteAccount(),
				},
				{
					text: "Cancel - Don't Delete",
					onPress: () => Alert.alert("Pheww, glad to see you stay!"),
				},
			],
			{ cancelable: true }
		);
	}
	const buttons = [
		{
			icon: <Icon name="block" />,
			text: "Blocked Users",
			onPress: () => navigation.navigate("Blocked"),
		},
		{
			icon: <Icon name="archive" />,
			text: "Event Archive",
			onPress: () => navigation.navigate("Archive"),
		},
		{
			icon: <Icon name="delete" type="MaterialCommunity" />,
			text: "Delete Account",
			onPress: () => handleConfirmDelete(),
		},
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
