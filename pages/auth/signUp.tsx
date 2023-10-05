import React, { useEffect } from "react";
import { useState } from "react";
import { Image, TextInput, View, Alert } from "react-native";
import { Colors, Fonts } from "../../styles/theme";
// @ts-expect-error
import LogoWhite from "../../assets/logo_white.png";
import authApi from "../../api/user/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "../../components/SmileNowUI";
// todo - make sure button is disabled if phone number is not 10 digits and code is not entered
// todo - make sure phone number is only numbers
// todo - loading indicator on "next" press
// todo - eyeball on password input

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
	const checkReadTerms = async () => {
		let read = await AsyncStorage.getItem("readTerms");
		if (!read) {
			navigation.navigate("Terms");
		}
	};

	useEffect(() => {
		checkReadTerms();
	}, []);
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
				Welcome to Smile Now
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
				variant="subTitle"
				colorScheme="background"
				style={{
					paddingHorizontal: 10,
					width: "100%",
				}}>
				Sign Up
			</Text>
			<TextInput
				placeholder="Enter your Phone Number"
				keyboardType="phone-pad"
				value={phone}
				onChangeText={setPhone}
				placeholderTextColor={Colors.border}
				returnKeyType={"done"}
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
			<Button
				onPress={signUp}
				disabled={phone.length < 10}
				variant="outlined"
				size="lg"
				colorScheme="white"
				style={{
					marginTop: 40,
					opacity: phone.length < 10 ? 0.5 : 1,
					width: "100%",
				}}>
				Next
			</Button>
			<Button
				variant="unstyled"
				size="lg"
				onPress={() => navigation.navigate("Login")}
				style={{
					marginTop: 10,
					color: Colors.background,
				}}>
				Login
			</Button>
		</View>
	);
}
