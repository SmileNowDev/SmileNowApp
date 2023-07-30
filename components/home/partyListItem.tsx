import React from "react";
import {
	Text,
	TouchableOpacity,
	View,
	TouchableWithoutFeedback,
	StyleSheet,
} from "react-native";
import Icon from "../core/icons";
import { Colors, Fonts } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import {
	generateColorFromLetters,
	generateSecondaryColorFromLetters,
} from "../../utils/colorGenerator";
import { PulseIndicator } from "react-native-indicators";
import { LinearGradient } from "expo-linear-gradient";
import { SquircleView } from "react-native-figma-squircle";
import * as Haptics from "expo-haptics";
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
	function HostBadge({ isHost }: { isHost: boolean }) {
		if (isHost)
			return (
				<View
					style={{
						position: "absolute",
						bottom: 0,
						right: 0,
						zIndex: 50,
						height: 20,
						width: 20,
						borderWidth: 2,
						borderColor: "#ffaa00",
						backgroundColor: "#fcba03",

						shadowOffset: { width: 0, height: 0 },
						shadowOpacity: 0.5,
						shadowRadius: 5,
						borderRadius: 10,
						alignItems: "center",
						justifyContent: "center",
						elevation: 3,

						transform: [
							{
								translateX: 3,
							},
							{ translateY: -5 },
						],
					}}>
					<Icon
						name={"crown"}
						color={"white"}
						size={10}
						type={"FontAwesome5"}
					/>
				</View>
			);
		else return <></>;
	}
	return (
		<View style={styles.shadowWrapper}>
			<LinearGradient
				colors={[Colors.background, Colors.foreground]}
				style={styles.gradientStyles}>
				<TouchableWithoutFeedback
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
						// @ts-ignore error
						navigation.navigate("Party", { eventId });
					}}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							padding: 6,
							gap: 8,
							justifyContent: "space-between",
						}}>
						<LinearGradient
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								bottom: 0,
								right: 0,
								opacity: 0.25,
							}}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							colors={[
								generateSecondaryColorFromLetters(initials),
								generateColorFromLetters(initials),
							]}
							locations={[0.2, 0.75]}
						/>
						<View style={styles.avatarContainer}>
							<HostBadge isHost={attendeeInfo?.isHost} />
							<SquircleView
								squircleParams={{
									cornerSmoothing: 0.9,
									cornerRadius: 18,
									fillColor: generateColorFromLetters(initials),
								}}
								style={{
									zIndex: 2,
									height: 45,
									width: 45,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									elevation: 0,
								}}>
								<Text style={{ fontSize: 22 }}>{initials}</Text>
							</SquircleView>
							{isActive && (
								<View
									style={{
										position: "absolute",
										zIndex: 1,
									}}></View>
							)}
						</View>

						<Text
							style={{
								flex: 1,
								fontFamily: Fonts.body.fontFamily,
								fontSize: Fonts.body.fontSize + 2,
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
							<TouchableOpacity
								// @ts-expect-error
								onPress={() => navigation.navigate("Camera", { eventId })}>
								<Icon
									name={"camera"}
									type="Ion"
									color={Colors.primary}
									size={30}
								/>
							</TouchableOpacity>
						) : (
							<Icon
								name="chevron-right"
								size={30}
								color={Colors.textSecondary + "70"}
							/>
						)}
					</View>
				</TouchableWithoutFeedback>
			</LinearGradient>
		</View>
	);
}
const styles = StyleSheet.create({
	shadowWrapper: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.125,
		shadowRadius: 3,
		elevation: 2,
		backgroundColor: Colors.border,
		padding: 0.5,
		marginHorizontal: 10,
		borderRadius: 10,
	},
	gradientStyles: {
		flex: 1,
		borderRadius: 10,
	},
	avatarContainer: {
		width: 55,
		position: "relative",
		overflow: "visible",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		padding: 10,
		paddingRight: 0,
		justifyContent: "flex-start",
	},
});
