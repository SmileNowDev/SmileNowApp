import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icons";
import { Colors } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
interface ListProps {
	icon: string;
	name: string;
	canPost: boolean;
}
export default function PartyListItem({ icon, name, canPost }: ListProps) {
	const navigation = useNavigation();
	return (
		<TouchableOpacity
			onPress={() => navigation.navigate("Party", { partyId: "asdbsadf" })}
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				gap: 5,
				padding: 10,
				justifyContent: "flex-start",
			}}>
			<View
				style={{
					backgroundColor: "pink",
					height: 40,
					width: 40,
					borderRadius: 20,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<Text style={{ fontSize: 25 }}>{icon}</Text>
			</View>
			<Text style={{ flex: 1 }}>{name}</Text>
			{canPost ? (
				<Icon name={"camera"} type="Ion" color={Colors.primary} size={20} />
			) : (
				<Icon name="chevron-right" size={20} color={Colors.textSecondary} />
			)}
		</TouchableOpacity>
	);
}
