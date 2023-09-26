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
import SettingButton from "../components/settings/settingsButton";
import ScreenWrapper from "../components/core/screenWrapper";
export default function Settings({ navigation }) {
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
			rightElement: (
				<Icon name="chevron-right" size={20} color={Colors.textSecondary} />
			),
		},
		{
			icon: <Icon name="archive" />,
			text: "Event Archive",
			onPress: () => navigation.navigate("Archive"),
			rightElement: (
				<Icon name="chevron-right" size={20} color={Colors.textSecondary} />
			),
		},
		{
			icon: <Icon name="delete" type="MaterialCommunity" />,
			text: "Delete Account",
			onPress: () => handleConfirmDelete(),
		},
		{
			icon: <Icon name="person" />,
			text: "Preferences",
			onPress: () => navigation.navigate("Preferences"),
			rightElement: (
				<Icon name="chevron-right" size={20} color={Colors.textSecondary} />
			),
		},
		{
			icon: <Icon name="logout" type="MaterialCommunity" />,
			text: "Logout",
			onPress: () => logout(),
		},
		{
			icon: <Icon name="person" />,
			text: "Component Library",
			onPress: () => navigation.navigate("ComponentLibrary"),
		},
	];
	return (
		<SafeAreaView>
			<ScreenWrapper analyticsTitle="Settings" loading={false}>
				<Header goBack title={"Settings"} />
				{buttons.map((button) => (
					<SettingButton {...button} />
				))}
			</ScreenWrapper>
		</SafeAreaView>
	);
}
