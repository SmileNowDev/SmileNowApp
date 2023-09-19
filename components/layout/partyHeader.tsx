import React, { Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { GlobalStyles } from "../../styles/styles";
import { Text } from "../SmileNowUI";
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
	// console.log({ title, eventId, name, isHost });
	const navigation = useNavigation();
	return (
		<View
			style={{
				...GlobalStyles.header,
				gap: 10,
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
					flex: 1,
					paddingRight: 10,
					maxWidth: "60%",
				}}>
				<Icon name={"chevron-left"} size={30} />

				<Text
					numberOfLines={1}
					ellipsize="tail"
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: 20,
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
						navigation.navigate("PartyAttendees", { eventId, isHost, name })
					}>
					<Icon name="people" size={25} color={Colors.textSecondary} />
				</TouchableOpacity>
				{isHost ? (
					<>
						<TouchableOpacity
							onPress={() =>
								// @ts-expect-error
								navigation.navigate("InviteToParty", { eventId })
							}>
							<Icon name="qr-code" size={25} color={Colors.textSecondary} />
						</TouchableOpacity>
					</>
				) : (
					<></>
				)}
				<TouchableOpacity
					onPress={() =>
						// @ts-expect-error
						navigation.navigate("PartySettings", { eventId, isHost })
					}>
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
