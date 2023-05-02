import React, { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../styles/styles";
import { RootStackParamList } from "../App";
interface HeaderProps {
	title: string;
	eventId: string;
	name: string;
	isHost?: boolean;
}
export default function PartyHeader({
	title,
	eventId,
	name,
	isHost,
}: HeaderProps) {
	const navigation = useNavigation();
	return (
		<View
			style={{
				...GlobalStyles.header,
			}}>
			<TouchableOpacity
				// @ts-expect-error
				onPress={() => navigation.navigate("Home")}
				style={{
					display: "flex",
					justifyContent: "flex-start",
					flexDirection: "row",
					alignItems: "center",
					gap: 10,
				}}>
				<Icon name={"chevron-left"} size={30} />

				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: 20,
						overflow: "hidden",
					}}>
					{title ? title : "Smile Now"}
				</Text>
			</TouchableOpacity>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "flex-end",
					alignItems: "center",
					gap: 15,
				}}>
				<TouchableOpacity
					onPress={() =>
						// @ts-expect-error
						navigation.navigate("InviteToParty", { eventId, name, isHost })
					}>
					<Icon name="people" size={25} color={Colors.textSecondary} />
				</TouchableOpacity>
				{isHost ? (
					<TouchableOpacity
						onPress={() =>
							// @ts-expect-error
							navigation.navigate("PartyDetails", { eventId, name })
						}>
						<Icon
							name="settings"
							type="Feather"
							size={25}
							color={Colors.textSecondary}
						/>
					</TouchableOpacity>
				) : (
					<></>
				)}
			</View>
		</View>
	);
}
