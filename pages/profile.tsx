import React, { useContext, useEffect, useState } from "react";
import {
	Image,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import Header from "../components/header";
import Icon from "../components/icons";
import userApi from "../api/user/user";
import { Context } from "../providers/provider";
export default function ProfilePage({ navigation }) {
	const [user, setUser] = useState({ name: "", pic: "", username: "" });
	const { userId } = useContext(Context);
	async function getUser() {
		const result = await userApi.get({ userId });
		if (result.ok) {
			//@ts-expect-error
			setUser(result.data);
		}
	}

	useEffect(() => {
		getUser();
	}, [userId]);

	return (
		<SafeAreaView>
			<Header goBack title={"My Profile"} />
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
						position: "relative",
						height: 150,
						width: 150,
						borderRadius: 75,
						marginBottom: 10,
					}}>
					{user.pic === "" ? (
						<Image
							source={require("../assets/logo_color.png")}
							style={{ width: "100%", height: "100%", borderRadius: 75 }}
						/>
					) : (
						<Image
							source={{ uri: user.pic }}
							style={{ width: "100%", height: "100%", borderRadius: 75 }}
						/>
					)}

					<TouchableOpacity
						onPress={() => navigation.navigate("TakeProfilePicture")}
						style={{
							position: "absolute",
							bottom: 0,
							right: 0,
							backgroundColor: Colors.background,
							padding: 4,
							borderRadius: 20,
						}}>
						<Icon name="account-edit" type={"MaterialCommunity"} size={30} />
					</TouchableOpacity>
				</View>
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
					@{user.username}
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
					onPress={() => {
						// TODO: open the app store page!
					}}
					style={{
						...styles.optionButton,
						backgroundColor: Colors.primaryLight,
					}}>
					<Icon name="star" type={"Feather"} size={30} />
					<Text>Rate Us!</Text>
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
					onPress={() => navigation.navigate("Settings")}
					style={{ ...styles.optionButton, backgroundColor: Colors.border }}>
					<Icon name="settings" type={"Feather"} size={30} />
					<Text>Settings</Text>
				</TouchableOpacity>
			</View>

			{/* TODO:  my pictures */}
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
