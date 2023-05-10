import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./core/icons";
import { Colors, Fonts } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { generateColorFromLetters } from "../utils/colorGenerator";
interface ListProps {
	icon: string;
	name: string;
	canPost: boolean;
	eventId: string;
}
export default function PartyListItem({
	icon,
	name,
	canPost,
	eventId,
}: ListProps) {
	const navigation = useNavigation();
	return (
		<TouchableOpacity
			// @ts-ignore error
			onPress={() => navigation.navigate("Party", { eventId })}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: 10,
				padding: 10,
				justifyContent: "flex-start",
			}}>
			<View
				style={{
					backgroundColor: generateColorFromLetters(icon),
					height: 40,
					width: 40,
					borderRadius: 20,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					shadowOpacity: 0.1,
					shadowOffset: { width: 0, height: 0 },
					shadowRadius: 5,
					elevation: 0,
				}}>
				<Text style={{ fontSize: 22 }}>{icon}</Text>
			</View>
			<Text
				style={{
					flex: 1,
					fontFamily: Fonts.body.fontFamily,
					fontSize: Fonts.body.fontSize,
				}}>
				{name}
			</Text>
			{canPost ? (
				<Icon name={"camera"} type="Ion" color={Colors.primary} size={30} />
			) : (
				<Icon
					name="chevron-right"
					size={30}
					color={Colors.textSecondary + "70"}
				/>
			)}
		</TouchableOpacity>
	);
}
