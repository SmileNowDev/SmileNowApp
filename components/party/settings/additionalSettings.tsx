import Icon from "../../core/icons";
import eventApi from "../../../api/post/event";
import React, { useContext } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Colors, Fonts } from "../../../styles/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import { IEvent } from "../../../pages/party/party";
import { useNavigation } from "@react-navigation/native";
import archiveApi from "../../../api/post/archive";
import { Context } from "../../../providers/provider";
import { ButtonColorSchemeType } from "../../SmileNowUI/button";
import { Button } from "../../SmileNowUI";
interface ISettingsButton {
	title: string;
	description: string;
	icon: string;
	buttonText: string;
	onPress: () => void;
	colorScheme?: ButtonColorSchemeType;
}
function SettingsButton({
	title,
	description,
	icon,
	buttonText,
	onPress,
	colorScheme,
}: ISettingsButton) {
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
			<Button
				onPress={onPress}
				size="xs"
				colorScheme={colorScheme || "gray"}
				leftIcon={<Icon name={icon} size={20} color={Colors.text} />}>
				{buttonText}
			</Button>
		</View>
	);
}
export default function AdditionalSettings({ eventId, isHost, archived }) {
	const { userId } = useContext(Context);
	const toast = useToast();
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const archiveMutation = useMutation(
		//@ts-expect-error
		({ eventId }) => archiveApi.create({ eventId }),
		{
			onSuccess: (data) => {
				// console.log("success - now this is archived");
				// console.log("data", data.data);
				queryClient.invalidateQueries(["events"]);
				// queryClient.setQueryData(["events"], (oldData) => ({
				// 	...(oldData as IEvent[]).filter((event) => event._id !== eventId),
				// })); //remove it from home
				queryClient.setQueryData(["event", eventId], (oldData) => ({
					...(oldData as IEvent),
					isArchived: data.data,
				}));
				queryClient.setQueryData(["archived_events"], (oldData) => ({
					...(oldData as IEvent[]),
					data,
				}));
				toast.show("Your party has been archived", {
					type: "success",
					placement: "top",
				});
				//@ts-expect-error
				navigation.navigate("Home");
			},
		}
	);
	const unArchiveMutation = useMutation(
		//@ts-expect-error
		({ eventId }) => archiveApi.deleteArchive({ eventId }),
		{
			onSuccess: (data) => {
				// console.log("success - event brought back");
				// console.log("data", data.data);
				queryClient.setQueryData(["events"], (oldData) => ({
					...(oldData as IEvent[]),
					data,
				})); // add it back to home
				queryClient.setQueryData(["event", eventId], (oldData) => ({
					...(oldData as IEvent),
					archived: false, // update this event's state
				}));
				toast.show("Your party has been restored", {
					type: "success",
					placement: "top",
				});
				//@ts-expect-error
				navigation.navigate("Home");
			},
		}
	);
	async function toggleArchive() {
		if (!archived) {
			// console.log("archiving a active party");
			//@ts-expect-error
			archiveMutation.mutate({ eventId });
		} else {
			// console.log("bringing an archived party back");
			//@ts-expect-error
			unArchiveMutation.mutate({ eventId });
		}
	}
	const deleteMutation = useMutation(
		//@ts-expect-error
		({ eventId }) => eventApi.deleteEvent({ eventId }),
		{
			onSuccess: (data) => {
				// console.log("success - event deleted");
				toast.show("Your party has been deleted", { placement: "top" });
				//@ts-expect-error
				navigation.navigate("Home");
			},
		}
	);
	async function deleteParty() {
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
					onPress: () => {
						//@ts-expect-error
						deleteMutation.mutate({ eventId });
					},
				},
			]
		);
	}
	const leaveMutation = useMutation(
		//@ts-expect-error
		({ eventId }) => eventApi.deleteEvent({ eventId }),
		{
			onSuccess: (data) => {
				// console.log("success - event deleted");
				toast.show("You have been removed from the event", {
					placement: "top",
				});
				//@ts-expect-error
				navigation.navigate("Home");
			},
		}
	);
	async function leaveParty() {
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
					onPress: () => {
						//@ts-expect-error
						leaveMutation.mutate({ eventId });
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
			<Button
				size="md"
				style={{ flex: 1, marginTop: 50 }}
				variant="outlined"
				colorScheme="danger"
				onPress={leaveParty}
				leftIcon={
					<Icon
						name="logout"
						color={Colors.danger}
						size={25}
						style={{
							transform: [{ rotate: "180deg" }],
						}}
					/>
				}>
				Leave Party
			</Button>
		</View>
	);
}
