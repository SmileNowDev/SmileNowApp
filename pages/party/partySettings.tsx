import React, { useState, useEffect, useContext } from "react";
import {
	SafeAreaView,
	Switch,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
	ActivityIndicator,
	StyleSheet,
	Button,
	Animated,
} from "react-native";
import Header from "../../components/layout/header";
import { ButtonStyles, GlobalStyles, Dim } from "../../styles/styles";
import { Colors, Fonts } from "../../styles/theme";
import Icon from "../../components/core/icons";
import eventApi from "../../api/post/event";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/rootNavigator";
import ScreenWrapper from "../../components/core/screenWrapper";
import archiveApi from "../../api/post/archive";
import attendeeApi from "../../api/post/attendee";
import { Context } from "../../providers/provider";
import { PulseIndicator } from "react-native-indicators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEvent, NotificationFrequencyType } from "./party";
import NotificationSettings from "../../components/party/notificationSettings";
import NameAndDescription from "../../components/party/settings/nameAndDescription";

type PartyDetailProps = StackScreenProps<RootStackParamList, "PartySettings">;

export default function PartySettings({ route, navigation }: PartyDetailProps) {
	const queryClient = useQueryClient();
	const { userId } = useContext(Context);
	const { eventId } = route.params;
	const data: IEvent = queryClient.getQueryData(["event", eventId]);
	console.log({ data });

	const [loading, setLoading] = useState<boolean>(false);
	const [notificationFrequency, setNotificationFrequency] =
		useState<NotificationFrequencyType>("normal");
	const [notificationStatus, setNotificationStatus] = useState(false);
	const [muted, setMuted] = useState<boolean>(false);
	const [archived, setArchived] = useState<boolean>(false);
	const [isSaved, setIsSaved] = useState(true);
	useEffect(() => {
		//when any setting changes, isSaved is false,
		//once result.ok is received by the backend, isSaved is will true -> handled in the mutation functions
		setIsSaved(false);
	}, [notificationFrequency, notificationStatus, muted, archived, isSaved]);
	const muteMutation = useMutation(
		// @ts-expect-error
		({ eventId, userId, muted }) =>
			attendeeApi.update({ eventId, userId, muted: !muted }),
		{
			onSuccess: (data) => {
				console.log("success");
				queryClient.setQueryData(["events"], (oldData) =>
					(oldData as IEvent[]).map((event) => {
						if (event._id === eventId) {
							return {
								...event,
								muted: !event.muted,
							};
						} else {
							return event;
						}
					})
				);
				//remove it from home
				queryClient.setQueryData(["event", eventId], (oldData) => ({
					...(oldData as IEvent),
					data,
				}));
			},
		}
	);
	async function handleMuting() {
		muteMutation.mutate(
			//@ts-expect-error
			{ eventId, userId, muted: data.muted },
			{
				onSuccess: () => {
					Alert.alert("Party Muted", "Join in again when you're ready!");
					navigation.navigate("Home");
				},
				onError: (error) => {
					// Handle the error here
					console.error(error);
				},
			}
		);
	}
	async function handleNotificationStatusChange() {
		// api to switch notification status
		const result = await eventApi.start({ eventId });
		if (result.ok) {
			setNotificationStatus(!notificationStatus);
		}
	}
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
		if (data.archived) {
			//@ts-expect-error
			archiveMutation.mutate(eventId);
		} else {
			//@ts-expect-error
			unArchiveMutation.mutate({ eventId });
		}
	}
	async function deleteParty() {
		async function yes() {
			const result = await eventApi.deleteEvent({ eventId });
			if (result.ok) {
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

	// async function save() {
	// 	// save the new name to the database
	// 	setLoading(true);
	// 	const result = await eventApi.updateEvent({
	// 		eventId,
	// 		title: newTitle,
	// 		description: newDescription,
	// 		settings: { notificationFrequency: data.notificationFrequency },
	// 	});
	// 	if (result.ok) {
	// 		Alert.alert("Your event has been updated", "Refresh to see your changes");

	// 		navigation.goBack();
	// 	} else {
	// 		Alert.alert("Error", "Something went wrong");
	// 	}
	// }

	function cancel() {
		// navigate back to the home page
		navigation.goBack();
	}

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

	function handleRefresh() {
		queryClient.invalidateQueries(["event", eventId]);
	}
	function SafeBackButton() {
		function checkIfCanGoBack() {
			navigation.goBack();
		}
		return (
			<View>
				<TouchableOpacity onPress={() => checkIfCanGoBack()}>
					<Icon name={"chevron-left"} size={30} />
				</TouchableOpacity>
			</View>
		);
	}
	return (
		<SafeAreaView style={{ flex: 1, height: Dim.height }}>
			<Header leftContent={<SafeBackButton />} title={`Party Settings`} />
			<ScreenWrapper
				scrollEnabled={true}
				onRefresh={handleRefresh}
				loading={loading}>
				{/* Name and Description */}
				<NameAndDescription
					isHost={data.isHost}
					title={data.title}
					description={data.description}
					id={data._id}
					notificationFrequency={data.notificationFrequency}
				/>
				{/* Notification State */}
				<View style={GlobalStyles.hr} />
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.button.fontSize,
						width: "100%",
						marginTop: 5,
					}}>
					Notification Settings
				</Text>
				<View
					style={{
						gap: 5,
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						padding: 5,
						marginTop: 10,
					}}>
					{data.notificationFrequency ? (
						<View>
							<PulseIndicator color={Colors.primary} size={20} />
						</View>
					) : (
						<Icon name="circle" size={20} color={Colors.textSecondary} />
					)}
					<View style={{ flex: 1 }}>
						<Text
							style={{
								fontFamily: Fonts.body.fontFamily,
								fontSize: Fonts.body.fontSize,
							}}>
							This party is {data.notificationFrequency ? "active" : "inactive"}
						</Text>
						<Text
							style={{
								flex: 0,
								fontFamily: Fonts.small.fontFamily,
								fontSize: Fonts.small.fontSize,
								color: Colors.textSecondary,
							}}>
							{data.notificationFrequency
								? "Notifications are being sent out randomly every few minutes"
								: "No notifications are being sent out right now, activate the party to start notifications"}
						</Text>
					</View>

					{data.isHost ? (
						<Switch
							//@ts-expect-error
							value={data.notificationStatus}
							onValueChange={handleNotificationStatusChange}
						/>
					) : (
						<></>
					)}
				</View>

				<View
					style={{
						gap: 5,
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "flex-start",
						padding: 5,
						marginTop: 10,
					}}>
					<Icon
						name={muted ? "notifications-off" : "notifications"}
						size={20}
						color={muted ? Colors.textSecondary : Colors.secondaryDark}
					/>
					<View style={{ flex: 1 }}>
						<Text
							style={{
								fontFamily: Fonts.body.fontFamily,
								fontSize: Fonts.body.fontSize,
							}}>
							Your notifications are {muted ? "muted" : "on"}
						</Text>
						<Text
							style={{
								fontFamily: Fonts.small.fontFamily,
								fontSize: Fonts.small.fontSize,
								color: Colors.textSecondary,
							}}>
							{muted
								? "You will not receive any notifications from this party, even if its active"
								: "You will receive notifications from this party when the party is active"}
						</Text>
					</View>

					<Switch value={!muted} onValueChange={handleMuting} />
				</View>

				<View style={GlobalStyles.hr} />

				<NotificationSettings
					isHost={data.isHost}
					notificationFrequency={data.notificationFrequency}
				/>
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
				{data.isHost ? (
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
				<View style={{ height: Dim.height / 2 }} />
			</ScreenWrapper>
		</SafeAreaView>
	);
}
