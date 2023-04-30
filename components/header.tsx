import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
interface HeaderProps {
	goBack?: boolean;
	title?: string;
	navigation: any;
}
export default function Header({
	navigation,
	goBack = false,
	title,
}: HeaderProps) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				paddingVertical: 10,
				paddingHorizontal: 15,
				backgroundColor: Colors.background,

				shadowOffset: { width: 0, height: 2 },
				shadowRadius: 8,
				shadowColor: "rgba(0, 0, 0, 0.25)",
				elevation: -2,
			}}>
			{/* back button */}
			{goBack ? (
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Icon name={"chevron-left"} size={30} />
				</TouchableOpacity>
			) : (
				<TouchableOpacity>
					<Icon name={"people"} size={30} />
				</TouchableOpacity>
			)}
			<Text
				style={{
					flex: 1,
					textAlign: "center",
					fontFamily: Fonts.title.fontFamily,
					fontSize: 20,
				}}>
				{title ? title : "SmileNow"}
			</Text>
			<TouchableOpacity onPress={() => navigation.navigate("Profile")}>
				<Icon name="person" size={30} />
			</TouchableOpacity>
			{/* profile button */}
		</View>
	);
}
