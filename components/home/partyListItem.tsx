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
	return (
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
							Colors.background,
							generateColorFromLetters(initials),
						]}
						locations={[0.2, 0.75, 0.95]}
					/>
					<View style={styles.avatarContainer}>
						{attendeeInfo?.isHost ? (
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
									style={{
										backgroundColor: "transparent",
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
								}}>
								<PulseIndicator
									color={generateColorFromLetters(initials)}
									size={60}
								/>
							</View>
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
						<Icon name={"camera"} type="Ion" color={Colors.primary} size={30} />
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
	);
}
const styles = StyleSheet.create({
	gradientStyles: {
		flex: 1,
		borderRadius: 10,
		marginHorizontal: 4,
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
