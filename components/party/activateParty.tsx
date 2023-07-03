import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import eventApi from "../../api/post/event";
import React from "react";
import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import Icon from "../core/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";

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
			<View
				style={{
					position: "absolute",
					alignItems: "center",
					bottom: 60,
					left: 30,
					right: 30,
					gap: 2.5,
					...GlobalStyles.Container,
					shadowColor: Colors.secondary,
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.5,
					shadowRadius: 10,
					elevation: 10,

					flex: 0,
					zIndex: 100,
				}}>
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
						Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
		);
	}
}
