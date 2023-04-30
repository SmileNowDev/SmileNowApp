import React from "react";
import { useState } from "react";
import {
	Button,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
// @ts-expect-error
import LogoWhite from "../../assets/logo_white.png";
import { ButtonStyles } from "../../styles/styles";
import Icon from "../../components/icons";
export default function SignUpPage({ navigation }) {
	const [phone, setPhone] = useState("");
	function handleNext() {
		navigation.navigate("VerifyPhone", { phone });
	}
	return (
		<View
			style={{
				backgroundColor: Colors.primary,
				flex: 1,
				padding: 20,
				paddingTop: 150,
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

			<TextInput
				placeholder="Enter your Phone Number"
				onChangeText={setPhone}
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
			<TouchableOpacity
				onPress={handleNext}
				// disabled={phone.length < 10}
				style={{
					...ButtonStyles.button,
					...ButtonStyles.outlinedWhite,
					marginTop: 40,
					borderRadius: 5,
					opacity: phone.length < 10 ? 0.5 : 1,
				}}>
				<Text style={{ color: Colors.background, fontSize: 20 }}>Next</Text>
			</TouchableOpacity>

			{/* header that lets you access party details */}
			{/* list of pictures */}
			{/* if they can, let them take a photo */}
		</View>
	);
}
