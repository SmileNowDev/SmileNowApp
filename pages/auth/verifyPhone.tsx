import React from "react";
import { useState, useContext } from "react";
import {
	Button,
	Image,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import Icon from "../../components/core/icons";
import authApi from "../../api/user/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Context } from "../../providers/provider";
import jwt_decode from "jwt-decode";

export default function VerifyPhonePage({ route, navigation }) {
	const { phone } = route.params;
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [errorText, setErrorText] = useState("");
	const { setLoggedIn, setUserId } = useContext(Context);
	function handleNext() {
		navigation.navigate("AccountDetails");
	}

	async function login() {
		const result = await authApi.login({ phone, password });
		if (result.ok) {
			//@ts-expect-error
			await AsyncStorage.setItem("access-token", result.data.accessToken);
			//@ts-expect-error
			await AsyncStorage.setItem("refresh-token", result.data.refreshToken);
			//@ts-expect-error

			const userId = await jwt_decode(result.data.accessToken)._id;
			setUserId(userId);
			setLoggedIn(true);
			handleNext();
		} else {
			Alert.alert("Error authenticating");
		}
	}

	async function verifyAccount() {
		const result = await authApi.verify({ phone, code, password });
		if (result.ok) {
			await login();
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
					placeholder="Create a Password"
					secureTextEntry={true}
					onChangeText={setPassword}
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
				<Text
					style={{
						color: Colors.foreground,
						marginTop: 5,
						textAlign: "center",
					}}>
					(Password must be at least 8 characters)
				</Text>
				<TouchableOpacity
					onPress={verifyAccount}
					// disabled={code.length < 5 && password.length < 8}
					style={{
						...ButtonStyles.button,
						...ButtonStyles.outlinedWhite,
						marginTop: 40,
						opacity: code.length < 5 && password.length < 8 ? 0.5 : 1,
					}}>
					<Text style={{ color: Colors.background, fontSize: 20 }}>
						Create Account
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
