import React, { useEffect, useContext } from "react";
import { SafeAreaView, Text } from "react-native";
import { Context } from "../providers/provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { Fonts } from "../styles/theme";
export default function SplashPage({ navigation }) {
	const { setUserId, setLoggedIn } = useContext(Context);

	async function init() {
		let token = await AsyncStorage.getItem("access-token");
		if (token) {
			setLoggedIn(true);
			// @ts-expect-error
			const userId = await jwt_decode(token)._id;
			navigation.navigate("Home");
			setUserId(userId);
		} else {
			navigation.navigate("Login");
		}
	}
	// @ts-expect-error
	useEffect(() => {
		init();
	}, []);
	return (
		<SafeAreaView>
			<Text
				style={{
					fontStyle: Fonts.title.fontFamily,
					fontSize: Fonts.title.fontSize,
				}}>
				SmileNow
			</Text>
		</SafeAreaView>
	);
}
