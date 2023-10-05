import Icon from "../../core/icons";
import eventApi from "../../../api/post/event";
import React, { useContext, useState } from "react";
import { Alert, View } from "react-native";
import { Colors, Fonts } from "../../../styles/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import { IEvent } from "../../../pages/party/party";
import { useNavigation } from "@react-navigation/native";
import archiveApi from "../../../api/post/archive";
import { Context } from "../../../providers/provider";
import { ButtonColorSchemeType } from "../../SmileNowUI/button";
import { Button, Text } from "../../SmileNowUI";
import { trackEvent } from "@aptabase/react-native";
import { GlobalStyles } from "../../../styles/styles";
import QueryLoadingStatus from "../../core/queryLoadingStatus";
interface ISettingsButton {
	title: string;
	description: string;
	icon: string;
	buttonText: string;
	onPress: () => void;
	colorScheme?: ButtonColorSchemeType;
	disabled?: boolean;
}
function SettingsButton({
	title,
	description,
	icon,
	buttonText,
	onPress,
	colorScheme,
	disabled,
}: ISettingsButton) {
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "flex-start",
				width: "100%",
				gap: 10,
				marginBottom: 5,
				...GlobalStyles.Container,
				backgroundColor: Colors.background,
			}}>
			<View
				style={{
					flex: 1,
				}}>
				<Text>{title}</Text>
				<Text
					variant="small"
					colorScheme="textSecondary"
					style={{
						flex: 0,
					}}>
					{description}
				</Text>
			</View>
			<Button
				onPress={onPress}
				size="sm"
				variant="outlined"
				disabled={disabled}
				style={{
					width: 125,
					paddingVertical: 10,
				}}
				colorScheme={colorScheme || "gray"}
				leftIcon={
					<Icon
						name={icon}
						size={20}
						color={
							colorScheme === "danger"
								? Colors.danger
								: colorScheme === "success"
								? Colors.success
								: Colors.textSecondary
						}
					/>
				}>
				{buttonText}
			</Button>
		</View>
	);
}
export default function AdditionalSettings({
	eventId,
	isHost,
	archived,
	active,
}) {
	const { userId } = useContext(Context);
	const toast = useToast();
	const navigation = useNavigation();
	const queryClient = useQueryClient();
	const [isActive, setIsActive] = useState(active);
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
				trackEvent("archiveParty", {
					isArchiving: false,
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
	const pauseMutation = useMutation((eventId) => eventApi.start({ eventId }), {
		onSuccess: (data) => {
			// =====
			//example
			// onSuccess: (data) => {
			// 	//@ts-expect-error
			// 	let muted = !data.data.muted;

			// 	setIsMuted(muted);
			// 	let message = muted
			// 		? "Your notifications are off 🤫"
			// 		: "You're now unmuted! 🎉";
			// 	toast.show(message);
			// 	if (muted) {
			// 		trackEvent("Party_Action", {
			// 			action_name: "muteNotifications",
			// 		});
			// 	} else {
			// 		trackEvent("Party_Action", {
			// 			action_name: "unmuteNotifications",
			// 		});
			// 	}
			// 	queryClient.setQueryData(["event", eventId], (oldData) => ({
			// 		...(oldData as IEvent),
			// 		//@ts-expect-error
			// 		muted: data.data.muted,
			// 	}));

			// =====

			console.log("data", data.data);

			// @ts-expect-error
			let isActive = !data.data.started;
			setIsActive(isActive);
			if (isActive) {
				trackEvent("Party_Action", {
					action_name: "pauseParty",
				});
			} else {
				trackEvent("Party_Action", {
					action_name: "resumeParty",
				});
			}
			let message = isActive
				? "The party is back on 😎"
				: "The party is paused now 😢";
			toast.show(message, {
				type: "info",
			});
			queryClient.invalidateQueries(["event", eventId]);
			queryClient.setQueryData(["event", eventId], (oldData) => ({
				...(oldData as IEvent),
				isActive,
			}));
		},
		onError: (error) => {
			// console.log(error);
			toast.show("Something went wrong, try again later", {
				type: "danger",
			});
		},
	});
	async function handlePauseParty() {
		pauseMutation.mutate(eventId);
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
				trackEvent("leaveParty");
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
			{isActive ? <></> : <></>}
			<View></View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 20,
					marginTop: 5,
				}}>
				<Text
					variant="subTitle"
					style={{
						fontSize: 20,
					}}>
					Additional Settings
				</Text>
				<QueryLoadingStatus
					isLoading={pauseMutation.isLoading}
					status={pauseMutation.status}
				/>
			</View>

			{isHost ? (
				<>
					<SettingsButton
						title={isActive ? "Pause Party" : "Resume Party"}
						description={
							isActive
								? "Temporarily pause this event, you can restart it later"
								: "Get the party going again, like it never even stopped!"
						}
						icon={isActive ? "pause" : "play-circle-filled"}
						buttonText={isActive ? "Pause" : "Resume"}
						colorScheme={isActive ? "gray" : "success"}
						onPress={() => {
							handlePauseParty();
						}}
					/>
					<SettingsButton
						title="End Party"
						description="Wrap up the event to unlock make the most of your pictures!"
						icon="cancel"
						buttonText="End Party"
						onPress={() => {
							Alert.alert("Implement the end party api ya bum");
						}}
					/>
					<SettingsButton
						title="Delete Party"
						description={
							"This permanently deletes the party and all its pictures"
						}
						colorScheme="danger"
						icon="delete"
						buttonText="Delete"
						onPress={deleteParty}
					/>
				</>
			) : (
				<>
					{!pauseMutation.data ? (
						<>
							<SettingsButton
								title={archived ? "Unarchive Party" : "Archive Party"}
								description={
									archived
										? "Archived parties are accessible from your profile, but won't show up on the home page"
										: "Bring this party back to your home page"
								}
								icon={archived ? "unarchive" : "archive"}
								buttonText={archived ? "Unarchive" : "Archive"}
								onPress={toggleArchive}
							/>
						</>
					) : (
						<></>
					)}
					<SettingsButton
						title="Leave Party"
						description={"No Don't go, you're so sexy ah hhaa"}
						icon="logout"
						buttonText="Leave"
						onPress={leaveParty}
						colorScheme="danger"
					/>
				</>
			)}
		</View>
	);
}
