import React, { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
interface HeaderProps {
	title: string;
	setInvitesVisible: Dispatch<SetStateAction<boolean>>;
	setDetailsVisible: Dispatch<SetStateAction<boolean>>;
	navigation: any;
}
export default function PartyHeader({
	title,
	setInvitesVisible,
	setDetailsVisible,
	navigation,
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
				elevation: 2,
			}}>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Icon name={"chevron-left"} size={30} />
			</TouchableOpacity>

			<Text
				style={{
					flex: 1,
					fontFamily: Fonts.title.fontFamily,
					fontSize: 20,
					overflow: "hidden",
				}}>
				{title ? title : "SmileNow"}
			</Text>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-end",
					alignItems: "center",
					gap: 15,
				}}>
				<TouchableOpacity onPress={() => navigation.navigate("Profile")}>
					<Icon
						name="person-add-alt-1"
						size={25}
						color={Colors.textSecondary}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate("Profile")}>
					<Icon
						name="settings"
						type="Feather"
						size={25}
						color={Colors.textSecondary}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
