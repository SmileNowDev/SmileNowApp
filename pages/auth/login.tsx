import React from "react";
import { useState, useContext } from "react";
import {
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
	Keyboard,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
// @ts-expect-error
import LogoWhite from "../../assets/logo_white.png";
import Icon from "../../components/core/icons";
import authApi from "../../api/user/auth";
import { Context } from "../../providers/provider";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "../../components/SmileNowUI/button";

export default function LoginPage({ navigation }) {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const { setUserId, setLoggedIn } = useContext(Context);

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
			navigation.navigate("Home");
		} else {
			Alert.alert("Error authenticating");
		}
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
				Welcome Back!
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
				value={phone}
				onChangeText={setPhone}
				keyboardType="phone-pad"
				autoFocus={true}
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
			<TextInput
				placeholder="Enter your password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry={true}
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
					marginTop: 20,
				}}
			/>
			<Button
				onPress={login}
				disabled={phone.length < 10}
				variant="outlined"
				size="lg"
				colorScheme="white"
				style={{
					marginTop: 40,
					opacity: phone.length < 10 ? 0.5 : 1,
					width: "100%",
				}}>
				Login
			</Button>
			<Button
				variant="unstyled"
				size="lg"
				onPress={() => navigation.navigate("ForgotPass")}
				style={{
					marginTop: 10,
					color: Colors.background,
				}}>
				Forgot Password?
			</Button>
		</View>
	);
}
