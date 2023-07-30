import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import eventApi from "../../api/post/event";
import React from "react";
import { ButtonStyles, Dim, GlobalStyles } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import Icon from "../core/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

export default function ActivateParty({ isActive, eventId, isHost }) {
	const queryClient = useQueryClient();
	const mutation = useMutation((eventId) => eventApi.start({ eventId }), {
		onSuccess: () => {
			console.log("success");
			queryClient.setQueryData(["event", eventId], (oldData) => {
				//@ts-expect-error
				return { ...oldData, isActive: true };
			});
		},
	});
	async function activateParty() {
		mutation.mutate(eventId, {
			onSuccess: () => {
				Alert.alert("Party Activated", "Have fun!");
			},
			onError: (error) => {
				// Handle the error here
				console.error(error);
			},
		});
	}
	if (!isHost) return <></>;
	else if (isHost && isActive) return <></>;
	else {
		return (
			<LinearGradient
				colors={["transparent", Colors.textSecondary]}
				locations={[0.15, 1]}
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: Dim.height * 0.25,
					zIndex: 40,
				}}>
				<View
					style={{
						...GlobalStyles.footerButtonContainer,
					}}>
					<View style={{ paddingBottom: 60 }}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								gap: 10,
								marginBottom: 10,
							}}>
							<Text
								style={{
									fontFamily: Fonts.body.fontFamily,
									fontSize: Fonts.body.fontSize,
								}}>
								Your party is inactive
							</Text>
							<Icon
								name="emoticon-sad-outline"
								type="MaterialCommunity"
								size={25}
							/>
						</View>
						<TouchableOpacity
							onPress={() => {
								Haptics.notificationAsync(
									Haptics.NotificationFeedbackType.Success
								);
								activateParty();
							}}
							style={{
								...ButtonStyles.buttonLarge,
								...ButtonStyles.primary,
								width: "100%",
							}}>
							<Image
								source={require("../../assets/logo_white.png")}
								style={{ width: 30, height: 30 }}
							/>
							<Text
								style={{
									...ButtonStyles.buttonTextLarge,
								}}>
								Activate Party
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		);
	}
}
