import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../styles/styles";
interface HeaderProps {
	goBack?: boolean;
	title?: string;
}
export default function Header({ goBack = false, title }: HeaderProps) {
	const navigation = useNavigation();
	return (
		<View
			style={{
				...GlobalStyles.header,
			}}
		>
			{goBack && (
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Icon name={"chevron-left"} size={30} />
				</TouchableOpacity>
			)}

			<Text
				style={{
					flex: 1,
					textAlign: "center",
					fontFamily: Fonts.title.fontFamily,
					fontSize: 20,
				}}
			>
				{title ? title : "Smile Now"}
			</Text>
			{goBack && <View style={{ width: 30 }} />}
		</View>
	);
}
