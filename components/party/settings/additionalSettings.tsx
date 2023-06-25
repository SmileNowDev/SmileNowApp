import Icon from "../../core/icons";
import eventApi from "../../../api/post/event";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Button,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { ButtonStyles, Dim, GlobalStyles } from "../../../styles/styles";
import { Colors, Fonts } from "../../../styles/theme";
import { debounce } from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import { IEvent } from "../../../pages/party/party";
import { useNavigation } from "@react-navigation/native";
import archiveApi from "../../../api/post/archive";
import { Context } from "../../../providers/provider";
import attendeeApi from "../../../api/post/attendee";
function SettingsButton({ title, description, icon, buttonText, onPress }) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
				alignItems: "flex-start",
				width: "100%",
				gap: 50,
				marginVertical: 10,
			}}>
			<View
				style={{
					flex: 1,
				}}>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						color: Colors.text,
					}}>
					{title}
				</Text>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
						flex: 0,
					}}>
					{description}
				</Text>
			</View>
			<TouchableOpacity
				onPress={onPress}
				style={{
					...ButtonStyles.buttonSmall,
					...ButtonStyles.gray,
				}}>
				<Icon name={icon} size={15} color={Colors.text} />
				<Text
					style={{
						...ButtonStyles.buttonTextSmall,
						color: Colors.text,
					}}>
					{buttonText}
				</Text>
			</TouchableOpacity>
		</View>
	);
}
export default function AdditionalSettings({ eventId, isHost, archived }) {
	const { userId } = useContext(Context);

	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const archiveMutation = useMutation(
		(eventId) => archiveApi.deleteArchive({ eventId }),
		{
			onSuccess: (data) => {
				console.log("success");
				queryClient.setQueryData(["events"], (oldData) => ({
					...(oldData as IEvent[]).filter((event) => event._id !== eventId),
				})); //remove it from home
				queryClient.setQueryData(["event", eventId], (oldData) => ({
					...(oldData as IEvent),
					data,
				}));
			},
		}
	);
	const unArchiveMutation = useMutation(
		(eventId) => archiveApi.create({ eventId }),
		{
			onSuccess: (data) => {
				console.log("success");
				queryClient.setQueryData(["events"], (oldData) => ({
					...(oldData as IEvent[]),
					data,
				})); // add it back to home
				queryClient.setQueryData(["event", eventId], (oldData) => ({
					...(oldData as IEvent),
					data, // update this event's state
				}));
			},
		}
	);
	async function toggleArchive() {
		if (!archived) {
			console.log("archiving a active party");
			archiveMutation.mutate(eventId);
		} else {
			console.log("bringing an archived party back");
			//@ts-expect-error
			unArchiveMutation.mutate({ eventId });
		}
	}
	async function deleteParty() {
		async function yes() {
			const result = await eventApi.deleteEvent({ eventId });
			if (result.ok) {
				//@ts-expect-error
				navigation.navigate("Home");
			} else {
			}
		}
		Alert.alert(
			"Are you sure you want to delete this event?",
			"This action is irreversible and all posts will be deleted as well, forever.",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{
					text: "Accept",
					onPress: async () => {
						yes();
					},
				},
			]
		);
	}
	async function leaveParty() {
		async function yes() {
			console.log({ eventId, userId });
			const result = await attendeeApi.deleteAttendee({ eventId, userId });
			if (result.ok) {
				//@ts-expect-error
				navigation.navigate("Home");
			} else {
				console.log(result);
			}
		}
		Alert.alert(
			"Are you sure you want to leave?",
			"If you leave, a host will have to reinvite you!",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{
					text: "Accept",
					onPress: async () => {
						yes();
					},
				},
			]
		);
	}
	return (
		<View>
			{/* Party Settings */}
			<Text
				style={{
					fontFamily: Fonts.subTitle.fontFamily,
					fontSize: Fonts.button.fontSize,
					width: "100%",
					marginTop: 5,
				}}>
				Party Settings
			</Text>
			{!archived ? (
				<SettingsButton
					title="Archive Party"
					description={
						"Archived parties are accessible from your profile, but won't show up on the home page"
					}
					icon="archive"
					buttonText="Archive"
					onPress={toggleArchive}
				/>
			) : (
				<SettingsButton
					title="Unarchive Party"
					description={"Bring this party back to your home page"}
					icon="unarchive"
					buttonText="Unarchive"
					onPress={toggleArchive}
				/>
			)}
			{isHost ? (
				<SettingsButton
					title="Delete Party"
					description={
						"This permanently deletes the party and all its pictures"
					}
					icon="delete"
					buttonText="Delete"
					onPress={deleteParty}
				/>
			) : (
				<></>
			)}
			<TouchableOpacity
				style={{
					...ButtonStyles.button,
					...ButtonStyles.outlined,
					marginTop: 10,
				}}
				onPress={leaveParty}>
				<Icon
					name="logout"
					size={25}
					style={{
						transform: [{ rotate: "180deg" }],
					}}
				/>
				<Text
					style={{
						fontSize: 18,
					}}>
					Leave Party
				</Text>
			</TouchableOpacity>
		</View>
	);
}
