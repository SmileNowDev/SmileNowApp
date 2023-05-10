import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../../styles/styles";
import { RootStackParamList } from "../../navigation/rootNavigator";

export default function HomeHeader() {
	const navigation = useNavigation();
	return (
		<View
			style={{
				...GlobalStyles.header,
			}}>
			<TouchableOpacity
				onPress={() =>
					navigation.navigate("Friends" as keyof RootStackParamList["Friends"])
				}>
				<Icon name={"people"} size={30} />
			</TouchableOpacity>
			<View
				style={{
					flex: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
					gap: 5,
				}}>
				<Image
					source={require("../../assets/logo_color.png")}
					style={{ width: 25, height: 25 }}
				/>
				<Text
					style={{
						textAlign: "center",
						fontFamily: "Exo_700Bold",
						fontSize: 20,
						color: Colors.primary,
					}}>
					Smile Now
				</Text>
			</View>
			<TouchableOpacity
				onPress={() =>
					navigation.navigate("Profile" as keyof RootStackParamList["Profile"])
				}>
				<Icon name="person" size={30} />
			</TouchableOpacity>
			{/* profile button */}
		</View>
	);
}