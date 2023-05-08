import React from "react";
import { useState } from "react";
import {
	Button,
	Image,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import userApi from "../../api/user/user";
export default function AccountDetailsScreen({ navigation }) {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	function handleSetUsername(newName) {
		//blocked characters
		const blocked = [" ", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
		// if username is too long, don't update
		if (username.length > 15) return;
		// if username contains blocked characters, don't update
		if (blocked.includes(newName[newName.length - 1])) return;
		setUsername(newName);
	}
	async function uploadDetails() {
		const result = await userApi.updateUser({
			name,
			username,
			bio: "Add a bio...",
		});
		if (result.ok) {
			navigation.navigate("Home");
		}
		// todo: if !result.ok, show error message with an alert
		// todo: if username is taken, or invalid
	}

	return (
		<SafeAreaView
			style={{
				backgroundColor: Colors.primary,
				flex: 1,
				display: "flex",
				alignItems: "center",
			}}>
			<View style={GlobalStyles.ScreenContainer}>
				<TextInput
					placeholder="Name"
					onChangeText={setName}
					placeholderTextColor={Colors.border}
					style={{
						width: "100%",
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: Colors.background,
						borderRadius: 5,
						paddingVertical: 10,
						paddingHorizontal: 10,
						fontSize: 20,
						color: Colors.background,
					}}
				/>
				<TextInput
					placeholder="username"
					onChangeText={(newName) => handleSetUsername(newName)}
					placeholderTextColor={Colors.border}
					style={{
						width: "100%",
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: Colors.background,
						borderRadius: 5,
						paddingVertical: 10,
						paddingHorizontal: 10,
						fontSize: 20,
						color: Colors.background,
						marginTop: 10,
					}}
				/>
				<Text style={{ color: Colors.foreground, textAlign: "center" }}>
					(Must be at least 5-15 characters)
				</Text>
				<TouchableOpacity
					onPress={uploadDetails}
					// disabled={name.length < 1 && username.length < 5}
					style={{
						...ButtonStyles.button,
						...ButtonStyles.outlinedWhite,
						opacity: name.length < 1 && username.length < 5 ? 0.5 : 1,
						marginTop: 40,
					}}>
					<Text style={{ color: Colors.background, fontSize: 20 }}>
						Complete Profile
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
