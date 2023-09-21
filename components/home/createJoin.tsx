import { Dim, GlobalStyles } from "../../styles/styles";
import JoinPartyPage from "../../pages/joinParty";
import ModalWrapper from "../core/modalWrapper";
import React, { useState } from "react";
import { View, Alert } from "react-native";
import eventApi from "../../api/post/event";
import { Colors } from "../../styles/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../SmileNowUI";
import { useAptabase } from "@aptabase/react-native";
export default function CreateJoin({ navigation }) {
	const { trackEvent } = useAptabase();
	const [joining, setJoining] = useState(false);
	const queryClient = useQueryClient();
	const mutation = useMutation(() => eventApi.create(), {
		onSuccess: (data) => {
			//@ts-expect-error
			queryClient.setQueryData(["event", data.data._id], data.data);
			queryClient.setQueryData(["events", 1], (oldData) => {
				//@ts-expect-error
				if (!oldData?.pages || !Array.isArray(oldData.pages)) {
					return [[data.data]]; // Return the new data as the only page
				}
				// Create a copy of the first page and add the new data at the start
				//@ts-expect-error
				const firstPage = [data.data, ...oldData.pages[0]];

				// Replace the old first page with the new first page in the pages array
				//@ts-expect-error
				const newPages = [firstPage, ...oldData.pages.slice(1)];
				return newPages;
			});
		},
	});
	async function createEvent() {
		trackEvent("createEvent");
		mutation.mutate(null, {
			onSuccess: async (data) => {
				navigation.navigate("CreateParty", {
					//@ts-expect-error
					eventId: data.data._id,
				});
			},
			onError: (error) => {
				console.log(error);
				Alert.alert("Something Went Wrong", "We're sorry! Try again later :)");
				navigation.navigate("Home");
			},
		});
	}
	function handleJoin() {
		trackEvent("joinEvent");
		setJoining(true);
	}

	return (
		<>
			<ModalWrapper visible={joining} setVisible={setJoining} fullHeight={true}>
				<JoinPartyPage setVisible={setJoining} />
			</ModalWrapper>
			<LinearGradient
				pointerEvents="none"
				colors={["transparent", Colors.textSecondary]}
				locations={[0.15, 1]}
				style={{
					position: "absolute",
					bottom: 50,
					left: 0,
					right: 0,
					height: Dim.height * 0.25,
					zIndex: 40,
				}}
			/>
			<View style={GlobalStyles.footerButtonContainer}>
				<Button
					style={{ width: Dim.width / 2.1 }}
					size="xl"
					colorScheme="secondary"
					onPress={() => handleJoin()}>
					Join Party
				</Button>
				<Button
					size="xl"
					onPress={() => createEvent()}
					style={{ width: Dim.width / 2.1 }}>
					Create Party
				</Button>
			</View>
		</>
	);
}
