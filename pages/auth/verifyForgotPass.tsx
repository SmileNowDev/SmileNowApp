import React from "react";
import { useState } from "react";
import {
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import { GlobalStyles } from "../../styles/styles";
import authApi from "../../api/user/auth";
import { Button } from "../../components/SmileNowUI/button";

export default function VerifyPassPage({ route, navigation }) {
	const { phone } = route.params;
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [errorText, setErrorText] = useState("");

	async function verifyAccount() {
		const result = await authApi.newPassword({ phone, code, password });
		if (result.ok) {
			// await login();
			Alert.alert("Password Changed", "Now login with your new password");
			navigation.navigate("Login");
		} else {
			setErrorText("Something went wrong, try again.");
		}
	}
	return (
		<SafeAreaView
			style={{
				backgroundColor: Colors.primary,
				flex: 1,
				padding: 20,
				display: "flex",
				alignItems: "center",
			}}>
			<View style={GlobalStyles.ScreenContainer}>
				<Text
					style={{
						paddingTop: 30,
						textAlign: "center",
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.body.fontSize,
						marginBottom: 20,
						color: Colors.background,
					}}>
					Enter the code we just texted you
				</Text>
				<Text
					style={{
						color: Colors.background,
					}}>
					{errorText}
				</Text>

				<TextInput
					placeholder="Code"
					onChangeText={setCode}
					autoFocus={true}
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
					placeholder="Create a new Password"
					secureTextEntry={true}
					onChangeText={setPassword}
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
				<Text
					style={{
						color: Colors.foreground,
						marginTop: 5,
						textAlign: "center",
					}}>
					(Password must be at least 8 characters)
				</Text>
				<Button
					onPress={verifyAccount}
					variant="outlined"
					size="lg"
					colorScheme="white"
					disabled={code.length < 5 && password.length < 8}
					style={{
						marginTop: 40,
						opacity: code.length < 5 && password.length < 8 ? 0.5 : 1,
						width: "100%",
					}}>
					Confirm Password
				</Button>
			</View>
		</SafeAreaView>
	);
}
