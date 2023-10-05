import React, { useContext } from "react";
import {
	ActivityIndicator,
	Image,
	Linking,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Colors, Fonts } from "../styles/theme";
import Header from "../components/layout/header";
import Icon from "../components/core/icons";
import userApi from "../api/user/user";
import { Context } from "../providers/provider";
import { Picture } from "../components/avatar";
import { useQuery } from "@tanstack/react-query";
import ScreenWrapper from "../components/core/screenWrapper";
import { trackEvent } from "@aptabase/react-native";
export type UserType = {
	name: string;
	pic: string;
	username: string;
};
export default function ProfilePage({ navigation }) {
	const { userId } = useContext(Context);
	const { isLoading, data, error, isRefetching, refetch } = useQuery({
		queryKey: ["user", userId],
		queryFn: getUser,
	});
	async function getUser() {
		const result = await userApi.get({ userId });
		if (result.ok) {
			// console.log("user", result.data);
			let user: UserType = {
				//@ts-expect-error
				name: result.data.name,
				//@ts-expect-error
				pic: result.data.pic,
				//@ts-expect-error
				username: result.data.username,
			};
			return user;
		} else {
			// todo- add chrome dinosaur game if user is not found
			return {
				name: "User Not Found",
				pic: "",
				username: "please_try_again_later",
			};
		}
	}
	function refresh() {
		refetch();
	}
	if (isLoading)
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<View style={{ flex: 1, justifyContent: "center" }}>
					<ActivityIndicator size={"large"} color={Colors.primary} />
				</View>
			</SafeAreaView>
		);
	return (
		<SafeAreaView>
			<Header goBack title={"My Profile"} />
			<ScreenWrapper
				analyticsTitle="MyProfile"
				loading={isLoading}
				scrollEnabled={true}
				onRefresh={refresh}>
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
						<Picture pic={data.pic} size={150} />
						<TouchableOpacity
							onPress={() => {
								trackEvent("Page_View", {
									analyticsTitle: "TakeProfilePicture",
								});
								navigation.navigate("TakeProfilePicture");
							}}
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
						{data.name}
					</Text>
					<Text
						style={{
							fontFamily: Fonts.button.fontFamily,
							fontSize: Fonts.button.fontSize,
							color: Colors.textSecondary,
						}}>
						@{data.username}
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
							trackEvent("openLearnMore");
							Linking.openURL("https://smile.samschmitt.net");
						}}
						style={{
							...styles.optionButton,
							backgroundColor: Colors.primaryLight,
						}}>
						<Icon name="info" type={"Feather"} size={30} />
						<Text>Learn More</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("EditProfile");
						}}
						style={{
							...styles.optionButton,
							backgroundColor: Colors.secondaryLight,
						}}>
						<Icon name="edit" type={"Feather"} size={30} />
						<Text>Edit Profile</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("Settings");
						}}
						style={{ ...styles.optionButton, backgroundColor: Colors.border }}>
						<Icon name="settings" type={"Feather"} size={30} />
						<Text>Settings</Text>
					</TouchableOpacity>
				</View>
			</ScreenWrapper>
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
