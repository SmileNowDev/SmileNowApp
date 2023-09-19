import React, { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, TextInput, View } from "react-native";
import Header from "../components/layout/header";
import { Context } from "../providers/provider";
import userApi from "../api/user/user";
import { Colors, Fonts } from "../styles/theme";
import { Dim, GlobalStyles } from "../styles/styles";
import { Button } from "../components/SmileNowUI";

export default function EditProfilePage({ navigation }) {
	const { userId } = useContext(Context);
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
		if (name.length < 1) {
			Alert.alert("Name cannot be empty");
			return;
		} else if (username.length < 5 || username.length > 15) {
			Alert.alert("Username must be between 5 and 15 characters");
			return;
		} else {
			const result = await userApi.updateUser({ name, username });
			if (result.ok) {
				navigation.goBack();
			} else {
				// @ts-expect-error
				Alert.alert(result.data.msg);
			}
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
					autoCapitalize={"none"}
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
					onChangeText={handleSetUsername}
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
					<Button
						onPress={() => cancel()}
						variant="outlined"
						colorScheme="gray"
						style={{
							width: Dim.width / 2 - 15,
						}}>
						Discard Changes
					</Button>
					<Button
						onPress={() => save()}
						style={{
							width: Dim.width / 2 - 15,
						}}>
						Save Changes
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
