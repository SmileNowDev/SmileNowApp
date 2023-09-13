import React from "react";
import { useState } from "react";
import {
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
import Icon from "../../components/core/icons";
import authApi from "../../api/user/auth";
import { Button } from "../../components/SmileNowUI/button";
// todo - make sure button is disabled if phone number is not 10 digits and code is not entered
// todo - make sure phone number is only numbers
// todo - loading indicator on "next" press
// todo - eyeball on password input

export default function ForgotPassPage({ navigation }) {
	const [phone, setPhone] = useState("");
	function handleNext() {
		navigation.navigate("VerifyPass", { phone });
	}

	async function forgotPassword() {
		const result = await authApi.forgotPassword({ phone });
		if (result.ok) {
			handleNext();
		} else {
			Alert.alert("Something went wrong");
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
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				style={{
					position: "absolute",
					top: 60,
					left: 30,
				}}>
				<Icon name="arrow-back" color={Colors.background} size={30} />
			</TouchableOpacity>
			<Text
				style={{
					textAlign: "center",
					fontFamily: Fonts.subTitle.fontFamily,
					fontSize: Fonts.subTitle.fontSize,
					color: Colors.background,
				}}>
				Forgot Password
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
				onPress={forgotPassword}
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
		</View>
	);
}
