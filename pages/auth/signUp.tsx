import React from "react";
import { useState } from "react";
import {
	Button,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
// @ts-expect-error
import LogoWhite from "../../assets/logo_white.png";
import { ButtonStyles, Dim } from "../../styles/styles";
import Icon from "../../components/icons";
import authApi from "../../api/user/auth";
export default function SignUpPage({ navigation }) {
	const [phone, setPhone] = useState("");
	function handleNext() {
		navigation.navigate("VerifyPhone", { phone });
	}

	async function signUp() {
		const result = await authApi.cache({ phone });
		if (result.ok) {
			handleNext();
		} else {
			Alert.alert("User Already Exists");
		}
	}
	return (
		<View
			style={{
				backgroundColor: Colors.primary,
				flex: 1,
				padding: 20,
				paddingTop: 100,
				display: "flex",
				alignItems: "center",
			}}>
			{/* LOGO */}
			<Text
				style={{
					textAlign: "center",
					fontFamily: Fonts.subTitle.fontFamily,
					fontSize: Fonts.subTitle.fontSize,
					color: Colors.background,
				}}>
				Welcome to SmileNow
			</Text>
			<Image
				source={LogoWhite}
				style={{
					height: 150,
					width: 150,
					marginHorizontal: "auto",
					marginBottom: 50,
				}}
			/>
			<Text
				style={{
					textAlign: "left",
					paddingHorizontal: 10,
					width: "100%",

					fontFamily: Fonts.subTitle.fontFamily,
					fontSize: Fonts.subTitle.fontSize,
					color: Colors.background,
				}}>
				Sign Up
			</Text>
			<TextInput
				placeholder="Enter your Phone Number"
				keyboardType="phone-pad"
				value={phone}
				onChangeText={setPhone}
				placeholderTextColor={Colors.border}
				style={{
					width: "100%",
					borderBottomWidth: 1,
					borderStyle: "solid",
					borderColor: Colors.background,
					borderRadius: 5,
					paddingVertical: 10,
					paddingHorizontal: 10,
					fontSize: 20,
					color: Colors.background,
				}}
			/>
			<TouchableOpacity
				onPress={signUp}
				disabled={phone.length < 10}
				style={{
					...ButtonStyles.button,
					...ButtonStyles.outlinedWhite,
					marginTop: 40,
					borderRadius: 5,
					opacity: phone.length < 10 ? 0.5 : 1,
					width: "100%",
				}}>
				<Text style={{ ...ButtonStyles.buttonTextLarge }}>Next</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => navigation.navigate("Login")}
				style={{
					...ButtonStyles.button,
					marginTop: 10,
				}}>
				<Text style={{ ...ButtonStyles.buttonTextLarge }}>Login</Text>
			</TouchableOpacity>

			{/* header that lets you access party details */}
			{/* list of pictures */}
			{/* if they can, let them take a photo */}
		</View>
	);
}
