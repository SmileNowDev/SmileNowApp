import React, { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "./icons";
import { Colors, Fonts } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../styles/styles";
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
			}}
		>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Icon name={"chevron-left"} size={30} />
			</TouchableOpacity>

			<Text
				style={{
					flex: 1,
					fontFamily: Fonts.title.fontFamily,
					fontSize: 20,
					overflow: "hidden",
				}}
			>
				{title ? title : "Smile Now"}
			</Text>
			{isHost ? (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "flex-end",
						alignItems: "center",
						gap: 15,
					}}
				>
					<TouchableOpacity
						onPress={() =>
							// @ts-expect-error
							navigation.navigate("InviteToParty", { eventId, name, isHost })
						}
					>
						<Icon
							name='person-add-alt-1'
							size={25}
							color={Colors.textSecondary}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("PartyDetails", { eventId, name })
						}
					>
						<Icon
							name='settings'
							type='Feather'
							size={25}
							color={Colors.textSecondary}
						/>
					</TouchableOpacity>
				</View>
			) : (
				<></>
			)}
		</View>
	);
}
