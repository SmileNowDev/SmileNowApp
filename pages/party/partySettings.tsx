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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IEvent, NotificationFrequencyType } from "./party";
import NotificationsSettings from "../../components/party/settings/notificationsSettings";
import NameAndDescription from "../../components/party/settings/nameAndDescription";
import AdditionalSettings from "../../components/party/settings/additionalSettings";

type PartyDetailProps = StackScreenProps<RootStackParamList, "PartySettings">;

export default function PartySettings({ route, navigation }: PartyDetailProps) {
	const queryClient = useQueryClient();
	const { eventId } = route.params;
	const data: IEvent = queryClient.getQueryData(["event", eventId]);
	console.log("FROM SETTINGS QUERY");

	console.log(data);
	console.log("--------------------------");
	const [loading, setLoading] = useState<boolean>(false);

	const [archived, setArchived] = useState<boolean>(false);

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
				<NotificationsSettings
					eventId={eventId}
					title={data.title}
					description={data.description}
					notificationFrequency={data.notificationFrequency}
					isHost={data.isHost}
					muted={data.muted}
					active={data.isActive}
				/>
				<View style={GlobalStyles.hr} />
				<AdditionalSettings
					isHost={data.isHost}
					archived={data.archived}
					eventId={data._id}
				/>

				<View style={{ height: Dim.height / 2 }} />
			</ScreenWrapper>
		</SafeAreaView>
	);
}
