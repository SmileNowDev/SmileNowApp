import React, { useState, useEffect } from "react";
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
} from "react-native";
import Header from "../components/header";
import EmojiTextInput from "../components/emojiTextInput";
import { ButtonStyles, GlobalStyles, Dim } from "../styles/styles";
import { Colors, Fonts } from "../styles/theme";
import Icon from "../components/icons";
import eventApi from "../api/post/event";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
type PartyDetailsRouteProps = StackScreenProps<
	RootStackParamList,
	"PartyDetails"
>;
type NotificationFrequencyType = "slow" | "normal" | "fast";

export default function PartyDetailsPage({
	route,
	navigation,
}: PartyDetailsRouteProps) {
	const { eventId, name } = route.params;
	const [loading, setLoading] = useState(false);
	const [newName, setNewName] = useState(name);
	const [newDescription, setNewDescription] = useState("");
	const [notificationFrequency, setNotificationFrequency] =
		useState<NotificationFrequencyType>("normal");
	const [notificationStatus, setNotificationStatus] = useState(false);
	async function handleNotificationStatusChange() {
		// api to switch notification status
		const result = await eventApi.start({ eventId });
		if (result.ok) {
			setNotificationStatus(!notificationStatus);
		}
	}
	async function save() {
		// save the new name to the database
		setLoading(true);
		const result = await eventApi.updateEvent({
			eventId,
			title: newName,
			description: newDescription,
			settings: {
				notificationFrequency,
			},
		});
		if (result.ok) {
			Alert.alert("Your event has been updated", "Refresh to see your changes");

			navigation.goBack();
		} else {
			Alert.alert("Error", "Something went wrong");
		}
	}
	function cancel() {
		// navigate back to the home page
		navigation.goBack();
	}
	async function getEvent() {
		const result = await eventApi.getEvent({ eventId });
		if (result.ok) {
			// @ts-expect-error
			setNotificationStatus(result.data.event.started);
			// @ts-expect-error
			setNewDescription(result.data.event.description);
			setNotificationFrequency(
				// @ts-expect-error
				result.data.event.settings.notificationFrequency
			);
		}
	}

	useEffect(() => {
		setLoading(true);
		getEvent();
		setLoading(false);
	}, [eventId]);
	return (
		<SafeAreaView>
			<Header goBack title={"Party Details"} />
			{loading ? (
				<ActivityIndicator
					size={"large"}
					color={Colors.primary}
					style={{
						height: Dim.width - 20,
						width: Dim.width - 20,
						position: "absolute",
						top: Dim.width / 2,
						zIndex: 100,
					}}
				/>
			) : (
				<></>
			)}
			{/* Notification State */}
			<View
				style={{
					gap: 5,
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-start",
					padding: 10,
				}}
			>
				<Icon
					name='notifications'
					size={20}
					color={notificationStatus ? Colors.primary : Colors.textSecondary}
				/>
				<Text
					style={{
						flex: 1,
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}
				>
					Notifications Are {notificationStatus ? "On" : "Off"}
				</Text>
				<Switch
					value={notificationStatus}
					onValueChange={handleNotificationStatusChange}
				/>
			</View>
			{/* Notification Frequency */}
			<Text
				style={{
					fontFamily: Fonts.subTitle.fontFamily,
					fontSize: Fonts.button.fontSize,
					width: "100%",
					textAlign: "center",
				}}
			>
				Notification Frequency
			</Text>
			<View style={styles.frequencyContainer}>
				<TouchableOpacity
					onPress={() => setNotificationFrequency("fast")}
					style={{
						...styles.frequencyOption,
						backgroundColor:
							notificationFrequency === "fast"
								? Colors.tertiary + "50"
								: "transparent",
						borderColor:
							notificationFrequency === "fast"
								? Colors.tertiary
								: Colors.border,
					}}
				>
					<Icon
						name='rabbit'
						size={30}
						color={
							notificationFrequency === "fast"
								? Colors.tertiaryDark
								: Colors.textSecondary
						}
						type='MaterialCommunity'
					/>
					<Text
						style={{
							...styles.frequencyOptionText,
							color:
								notificationFrequency === "fast"
									? Colors.text
									: Colors.textSecondary,
						}}
					>
						Fast
					</Text>
					<Text style={styles.frequencyOptionSubtext}>Every 5-10 Minutes</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => setNotificationFrequency("normal")}
					style={{
						...styles.frequencyOption,
						backgroundColor:
							notificationFrequency === "normal"
								? Colors.primaryLight + "50"
								: "transparent",
						borderColor:
							notificationFrequency === "normal"
								? Colors.primary
								: Colors.border,
					}}
				>
					<Icon
						name='face'
						size={30}
						color={
							notificationFrequency === "normal"
								? Colors.primaryDark
								: Colors.textSecondary
						}
					/>
					<Text
						style={{
							...styles.frequencyOptionText,

							color:
								notificationFrequency === "normal"
									? Colors.text
									: Colors.textSecondary,
						}}
					>
						Normal
					</Text>
					<Text style={styles.frequencyOptionSubtext}>Every 15-30 Minutes</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setNotificationFrequency("slow")}
					style={{
						...styles.frequencyOption,
						backgroundColor:
							notificationFrequency === "slow"
								? Colors.secondaryLight + "50"
								: "transparent",
						borderColor:
							notificationFrequency === "slow"
								? Colors.secondary
								: Colors.border,
					}}
				>
					<Icon
						name='tortoise'
						size={30}
						color={
							notificationFrequency === "slow"
								? Colors.secondaryDark
								: Colors.textSecondary
						}
						type='MaterialCommunity'
					/>
					<Text
						style={{
							...styles.frequencyOptionText,
							color:
								notificationFrequency === "slow"
									? Colors.text
									: Colors.textSecondary,
						}}
					>
						Slow
					</Text>
					<Text style={styles.frequencyOptionSubtext}>Every 30-60 Minute</Text>
				</TouchableOpacity>
			</View>
			{/* Name and Description */}
			<View style={{ padding: 10 }}>
				<Text
					style={{
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
					}}
				>
					Name:
				</Text>
				<TextInput
					value={newName}
					placeholder='Enter a party Name'
					onChangeText={setNewName}
					clearButtonMode='always'
					style={{
						...GlobalStyles.textInput,
					}}
				/>
				<Text
					style={{
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
						marginTop: 20,
					}}
				>
					Description:
				</Text>
				<TextInput
					multiline
					numberOfLines={4}
					clearButtonMode='always'
					value={newDescription}
					placeholder='Enter a party Name'
					onChangeText={setNewDescription}
					style={{
						...GlobalStyles.textInput,
						height: 100,
					}}
				/>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
						gap: 5,
						paddingVertical: 5,
						marginTop: 20,
					}}
				>
					<TouchableOpacity
						onPress={() => cancel()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.outlined }}
					>
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Cancel Changes
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => save()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.primary }}
					>
						<Text style={{ ...ButtonStyles.buttonText }}>Save Changes</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
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
	frequencyOption: {
		width: Dim.width / 3 - 10,
		height: Dim.width / 3 - 10,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		borderWidth: 1,
		borderColor: Colors.textSecondary,
		borderRadius: 10,
		padding: 3,
	},
	frequencyOptionText: {
		marginTop: 10,
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.body.fontSize,
		color: Colors.textSecondary,
	},
	frequencyOptionSubtext: {
		fontFamily: Fonts.body.fontFamily,
		fontSize: Fonts.small.fontSize,
		color: Colors.textSecondary,
		textAlign: "center",
		width: Dim.width / 3 - 30,
	},
});
