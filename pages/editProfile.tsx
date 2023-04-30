import React, { useContext, useEffect, useState } from "react";
import {
	Alert,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../components/header";
import { Context } from "../providers/provider";
import userApi from "../api/user/user";
import { Colors, Fonts } from "../styles/theme";
import { ButtonStyles, GlobalStyles } from "../styles/styles";

export default function EditProfilePage({ navigation }) {
	const { userId } = useContext(Context);
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");

	async function getUser() {
		const result = await userApi.get({ userId });
		if (result.ok) {
			// @ts-expect-error
			setName(result.data?.name);
			// @ts-expect-error
			setUsername(result.data?.username);
		}
	}
	function cancel() {
		navigation.goBack();
	}
	async function save() {
		const result = await userApi.updateUser({ name, username });
		if (result.ok) {
			navigation.goBack();
		} else {
			Alert.alert("Error updating user");
		}
	}
	useEffect(() => {
		getUser();
	}, []);

	return (
		<SafeAreaView>
			<Header goBack title={"Edit Profile"} />
			<View style={{ padding: 10 }}>
				<Text
					style={{
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
					}}>
					Name
				</Text>
				<TextInput
					value={name}
					onChangeText={setName}
					style={{ ...GlobalStyles.textInput }}
				/>
				<Text
					style={{
						marginTop: 20,
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
					}}>
					Username
				</Text>
				<TextInput
					value={username}
					onChangeText={setUsername}
					style={{ ...GlobalStyles.textInput }}
				/>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						gap: 5,
						paddingVertical: 5,
						marginTop: 20,
					}}>
					<TouchableOpacity
						onPress={() => cancel()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.outlined }}>
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Cancel Changes
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => save()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.primary }}>
						<Text style={{ ...ButtonStyles.buttonText }}>Save Changes</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}
