import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../styles/styles";

export default function HomeHeader() {
	const navigation = useNavigation();
	return (
		<View
			style={{
				...GlobalStyles.header,
			}}>
			<TouchableOpacity onPress={() => navigation.navigate("Friends")}>
				<Icon name={"people"} size={30} />
			</TouchableOpacity>
			<Text
				style={{
					flex: 1,
					textAlign: "center",
					fontFamily: Fonts.title.fontFamily,
					fontSize: 20,
				}}>
				SmileNow
			</Text>
			<TouchableOpacity onPress={() => navigation.navigate("Profile")}>
				<Icon name="person" size={30} />
			</TouchableOpacity>
			{/* profile button */}
		</View>
	);
}
