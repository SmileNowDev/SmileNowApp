import Icon from "../../core/icons";
import eventApi from "../../../api/post/event";
import React, { useContext, useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	Switch,
	Text,
	View,
} from "react-native";
import { GlobalStyles } from "../../../styles/styles";
import { Colors, Fonts } from "../../../styles/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import { IEvent } from "../../../pages/party/party";
import { PulseIndicator } from "react-native-indicators";
import attendeeApi from "../../../api/post/attendee";
import { Context } from "../../../providers/provider";
import NotificationFrequencyButton from "./notificationFrequencyButton";
import QueryLoadingStatus from "../../core/queryLoadingStatus";
export default function NotificationsSettings({
	eventId,
	title,
	description,
	notificationFrequency,
	isHost,
	muted,
	active,
}) {
	const { userId } = useContext(Context);
	const queryClient = useQueryClient();
	const toast = useToast();

	const [notificationStatus, setNotificationStatus] = useState(active);
	const [isMuted, setIsMuted] = useState(muted);
	const [newNotificationFrequency, setNewNotificationFrequency] = useState(
		notificationFrequency || "normal"
	);
	const muteMutation = useMutation(
		// @ts-expect-error
		({ eventId, userId, muteStatus }) =>
			attendeeApi.update({ eventId, userId, muted: !muteStatus }),
		{
			onSuccess: (data) => {
				//@ts-expect-error
				let muted = !data.data.muted;
				console.log("muted was:", isMuted);

				console.log("success - muted: ", muted);
				setIsMuted(muted);
				let message = muted
					? "Your notifications are off 🤫"
					: "You're now unmuted! 🎉";
				toast.show(message);

				queryClient.setQueryData(["event", eventId], (oldData) => ({
					...(oldData as IEvent),
					//@ts-expect-error
					muted: data.data.muted,
				}));
			},
			onError: (error) => {
				console.log(error);
				toast.show("Something went wrong, try again later", {
					type: "danger",
				});
			},
		}
	);
	async function handleMuting() {
		console.log("here");
		muteMutation.mutate(
			//@ts-expect-error
			{ eventId, userId, muteStatus: isMuted }
		);
	}
	const activeMutation = useMutation((eventId) => eventApi.start({ eventId }), {
		onSuccess: (data) => {
			//@ts-expect-error
			setNotificationStatus(!data.data.started);
			//@ts-expect-error
			let message = !data.data.started
				? "The party is officially started 😎"
				: "The party is over 😢";
			toast.show(message, {
				type: "info",
			});
			queryClient.setQueryData(["event", eventId], (oldData) => ({
				...(oldData as IEvent),
				//@ts-expect-error
				isActive: data.data.started,
			}));
		},
		onError: (error) => {
			console.log(error);
			toast.show("Something went wrong, try again later", {
				type: "danger",
			});
		},
	});
	async function handleNotificationStatusChange() {
		console.log("here");
		// api to switch notification status
		activeMutation.mutate(eventId);
	}
	const notificationFrequencyMutation = useMutation(
		// @ts-expect-error
		({ eventId, frequency }) =>
			eventApi.updateEvent({
				eventId,
				title,
				description,
				settings: { notificationFrequency: frequency },
			}),
		{
			onSuccess: (data) => {
				console.log(data.data);
				let _newFrequency = newNotificationFrequency;
				// console.log("muted was:", isMuted);
				console.log("on success - frequency: ", _newFrequency);

				let message = `Your notifications are now on ${_newFrequency}`;
				toast.show(message, {
					type: "success",
				});
				if (_newFrequency !== undefined) {
					queryClient.setQueryData(["event", eventId], (oldData) => ({
						...(oldData as IEvent),
						notificationFrequency: newNotificationFrequency,
					}));
				}
			},
			onError: (error) => {
				console.log(error);
				toast.show("Something went wrong, try again later", {
					type: "danger",
				});
			},
		}
	);
	function handleFrequencyChange(frequency) {
		console.log("new notification frequency: ", frequency);
		setNewNotificationFrequency(frequency);

		notificationFrequencyMutation.mutate(
			//@ts-expect-error
			{ eventId, frequency }
		);
	}
	return (
		<View>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Text
					style={{
						fontFamily: Fonts.subTitle.fontFamily,
						fontSize: Fonts.button.fontSize,
						marginTop: 5,
					}}>
					Notification Settings
				</Text>
				<QueryLoadingStatus
					isLoading={activeMutation.isLoading || muteMutation.isLoading}
					status={activeMutation.status || muteMutation.status}
				/>
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
				{notificationStatus ? (
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
						This party is {notificationStatus ? "active" : "inactive"}
					</Text>
					<Text
						style={{
							flex: 0,
							fontFamily: Fonts.small.fontFamily,
							fontSize: Fonts.small.fontSize,
							color: Colors.textSecondary,
						}}>
						{notificationStatus
							? "Notifications are being sent out randomly every few minutes"
							: "No notifications are being sent out right now, activate the party to start notifications"}
					</Text>
				</View>

				{isHost ? (
					<Switch
						value={notificationStatus}
						onValueChange={handleNotificationStatusChange}
						disabled={activeMutation.isLoading}
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
					name={isMuted ? "notifications-off" : "notifications"}
					size={20}
					color={isMuted ? Colors.textSecondary : Colors.secondaryDark}
				/>
				<View style={{ flex: 1 }}>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
						}}>
						Your notifications are {isMuted ? "muted" : "on"}
					</Text>
					<Text
						style={{
							fontFamily: Fonts.small.fontFamily,
							fontSize: Fonts.small.fontSize,
							color: Colors.textSecondary,
						}}>
						{isMuted
							? "You will not receive any notifications from this party, even if its active"
							: "You will receive notifications from this party when the party is active"}
					</Text>
				</View>

				<Switch
					value={!isMuted}
					onValueChange={handleMuting}
					disabled={muteMutation.isLoading}
				/>
			</View>

			{notificationStatus ? (
				<View>
					<View style={GlobalStyles.hr} />
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						}}>
						<Text
							style={{
								fontFamily: Fonts.subTitle.fontFamily,
								fontSize: Fonts.button.fontSize,

								marginTop: 5,
							}}>
							Notification Frequency: {newNotificationFrequency}
						</Text>
						<QueryLoadingStatus
							isLoading={notificationFrequencyMutation.isLoading}
							status={notificationFrequencyMutation.status}
						/>
					</View>
					<View style={styles.frequencyContainer}>
						<NotificationFrequencyButton
							mode="fast"
							notificationFrequency={newNotificationFrequency}
							setNotificationFrequency={handleFrequencyChange}
							color={Colors.tertiary}
							title={"Fast"}
							subtext={"Every 5-10 Minutes"}
							icon={
								<Icon
									name="rabbit"
									size={30}
									color={
										newNotificationFrequency === "fast"
											? Colors.tertiaryDark
											: Colors.textSecondary
									}
									type="MaterialCommunity"
								/>
							}
							disabled={notificationFrequencyMutation.isLoading}
						/>
						<NotificationFrequencyButton
							mode="normal"
							notificationFrequency={newNotificationFrequency}
							setNotificationFrequency={handleFrequencyChange}
							color={Colors.primary}
							title={"Normal"}
							subtext={"Every 15-30 Minutes"}
							icon={
								<Icon
									name="face"
									size={30}
									color={
										newNotificationFrequency === "normal"
											? Colors.primaryDark
											: Colors.textSecondary
									}
								/>
							}
							disabled={notificationFrequencyMutation.isLoading}
						/>
						<NotificationFrequencyButton
							mode="slow"
							notificationFrequency={newNotificationFrequency}
							setNotificationFrequency={handleFrequencyChange}
							color={Colors.secondary}
							title={"Slow"}
							subtext={"Every 30-60 Minutes"}
							icon={
								<Icon
									name="tortoise"
									size={30}
									color={
										newNotificationFrequency === "slow"
											? Colors.secondaryDark
											: Colors.textSecondary
									}
									type="MaterialCommunity"
								/>
							}
							disabled={notificationFrequencyMutation.isLoading}
						/>
					</View>
				</View>
			) : (
				<></>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	frequencyContainer: {
		gap: 5,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
});
