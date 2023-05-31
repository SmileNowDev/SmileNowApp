import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { generateColorFromLetters } from "../../utils/colorGenerator";
import { PulseIndicator, MaterialIndicator } from "react-native-indicators";
interface ListProps {
	initials: string;
	name: string;
	canPost: boolean;
	eventId: string;
	attendeeInfo: {
		isHost: boolean;
		muted: boolean;
	};
	isActive: boolean;
}
export default function PartyListItem({
	initials,
	name,
	canPost,
	eventId,
	attendeeInfo,
	isActive,
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
				paddingRight: 0,
				justifyContent: "flex-start",
			}}>
			<View
				style={{
					position: "relative",
				}}>
				{attendeeInfo?.isHost ? (
					<View
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							zIndex: 50,

							transform: [
								{ rotate: "35deg" },
								{
									translateX: 2,
								},
								{ translateY: -10 },
							],
						}}>
						<Icon
							name={"crown"}
							color={"gold"}
							size={15}
							type={"FontAwesome5"}
							style={{
								shadowOpacity: 0.25,
								shadowOffset: { width: 0, height: 0 },
								shadowRadius: 5,
								shadowColor: "black",
								elevation: 0,
							}}
						/>
					</View>
				) : (
					<></>
				)}
				<View
					style={{
						backgroundColor: generateColorFromLetters(initials),
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
					<Text style={{ fontSize: 22 }}>{initials}</Text>
				</View>
			</View>

			<Text
				style={{
					flex: 1,
					fontFamily: Fonts.body.fontFamily,
					fontSize: Fonts.body.fontSize,
				}}>
				{name}
			</Text>
			{attendeeInfo?.muted && (
				<Icon
					name="moon"
					type="Ion"
					size={20}
					color={Colors.textSecondary + "75"}
				/>
			)}

			{isActive && (
				<View>
					<PulseIndicator color={Colors.primary} />
				</View>
			)}

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
