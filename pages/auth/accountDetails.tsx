import React from "react";
import { useState } from "react";
import { Alert, SafeAreaView, Text, TextInput, View } from "react-native";
import { Colors } from "../../styles/theme";
import { GlobalStyles } from "../../styles/styles";
import userApi from "../../api/user/user";
import { Button } from "../../components/SmileNowUI";
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
		if (name.length < 1) {
			Alert.alert("Name cannot be empty");
			return;
		} else if (username.length < 5 || username.length > 15) {
			Alert.alert("Username must be between 5 and 15 characters");
			return;
		} else {
			const result = await userApi.updateUser({
				name,
				username,
				bio: "Add a bio...",
			});
			if (result.ok) {
				navigation.navigate("Home");
			} else {
				// @ts-expect-error
				Alert.alert(result.data.msg);
			}
		}
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
					returnKeyType={"done"}
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
					returnKeyType={"done"}
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
					(Must be at least 4-16 characters)
				</Text>
				<Button
					size={"lg"}
					variant="outlined"
					colorScheme="white"
					onPress={uploadDetails}
					disabled={name.length < 4 && username.length > 16}
					style={{
						opacity: name.length < 1 && username.length < 5 ? 0.5 : 1,
						marginTop: 40,
						flex: 1,
					}}>
					Complete Profile
				</Button>
			</View>
		</SafeAreaView>
	);
}
