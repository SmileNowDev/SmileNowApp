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

export default function PartyDetailsPage({
	route,
	navigation,
}: PartyDetailsRouteProps) {
	const { eventId, name } = route.params;
	const [loading, setLoading] = useState(false);
	const [newName, setNewName] = useState(name);
	const [newDescription, setNewDescription] = useState("");
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
		});
		if (result.ok) {
			Alert.alert("Your party has been updated", "Refresh to see your changes");

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
			<View
				style={{
					gap: 5,
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-start",
					padding: 10,
				}}>
				<Icon
					name="notifications"
					size={20}
					color={notificationStatus ? Colors.primary : Colors.textSecondary}
				/>
				<Text
					style={{
						flex: 1,
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}>
					Notifications Are {notificationStatus ? "On" : "Off"}
				</Text>
				<Switch
					value={notificationStatus}
					onValueChange={handleNotificationStatusChange}
				/>
			</View>
			<View style={{ padding: 10 }}>
				<Text
					style={{
						fontFamily: Fonts.small.fontFamily,
						fontSize: Fonts.small.fontSize,
						color: Colors.textSecondary,
					}}>
					Name:
				</Text>
				<TextInput
					value={newName}
					placeholder="Enter a party Name"
					onChangeText={setNewName}
					clearButtonMode="always"
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
					}}>
					Description:
				</Text>
				<TextInput
					multiline
					numberOfLines={4}
					clearButtonMode="always"
					value={newDescription}
					placeholder="Enter a party Name"
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
					}}>
					<TouchableOpacity
						onPress={() => cancel()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.outlined }}>
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Cancel Changes
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => save()}
						style={{ ...ButtonStyles.button, ...ButtonStyles.primary }}>
						<Text style={{ ...ButtonStyles.buttonText }}>Save Changes</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}
