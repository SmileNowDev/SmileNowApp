import React from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import Header from "../../components/layout/header";
import { GlobalStyles, Dim } from "../../styles/styles";
import Icon from "../../components/core/icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/rootNavigator";
import ScreenWrapper from "../../components/core/screenWrapper";
import { useQueryClient } from "@tanstack/react-query";
import { IEvent } from "./party";
import NotificationsSettings from "../../components/party/settings/notificationsSettings";
import NameAndDescription from "../../components/party/settings/nameAndDescription";
import AdditionalSettings from "../../components/party/settings/additionalSettings";

type PartyDetailProps = StackScreenProps<RootStackParamList, "PartySettings">;

export default function PartySettings({ route, navigation }: PartyDetailProps) {
	const queryClient = useQueryClient();
	const { eventId, isHost } = route.params;
	const data: IEvent = queryClient.getQueryData(["event", eventId]);

	function handleRefresh() {
		queryClient.invalidateQueries(["event", eventId]);
	}
	function SafeBackButton() {
		return (
			<View>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Icon name={"chevron-left"} size={30} />
				</TouchableOpacity>
			</View>
		);
	}
	return (
		<SafeAreaView style={{ flex: 1, height: Dim.height }}>
			<Header leftContent={<SafeBackButton />} title={`Party Settings`} />
			<ScreenWrapper scrollEnabled={true} onRefresh={handleRefresh}>
				{/* Name and Description */}
				<NameAndDescription
					isHost={isHost || data.isHost}
					title={data.title}
					description={data.description}
					id={data._id}
					notificationFrequency={data.notificationFrequency}
				/>
				<View style={GlobalStyles.hr} />
				<NotificationsSettings
					eventId={eventId}
					title={data.title}
					description={data.description}
					notificationFrequency={data.notificationFrequency}
					isHost={data.isHost || isHost}
					muted={data.muted}
					active={data.isActive}
				/>
				<View style={GlobalStyles.hr} />
				<AdditionalSettings
					isHost={data.isHost || isHost}
					archived={data.archived}
					eventId={data._id}
					active={data.isActive}
				/>
				<View style={{ height: Dim.height / 2 }} />
			</ScreenWrapper>
		</SafeAreaView>
	);
}
