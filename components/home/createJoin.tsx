import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import JoinPartyPage from "../../pages/joinParty";
import ModalWrapper from "../core/modalWrapper";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import eventApi from "../../api/post/event";
import { Colors } from "../../styles/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateJoin({ navigation }) {
	const [joining, setJoining] = useState(false);
	const queryClient = useQueryClient();
	const mutation = useMutation(() => eventApi.create(), {
		onSuccess: (data) => {
			navigation.navigate("Party", {
				//@ts-expect-error
				eventId: data.data._id,
				justCreated: true,
			});
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
		mutation.mutate(null, {
			onSuccess: async (data) => {
				//@ts-expect-error
				console.log("created event: ", data.data._id);
			},
			onError: (error) => {
				console.log(error);
				Alert.alert("Something Went Wrong", "We're sorry! Try again later :)");
				navigation.navigate("Home");
			},
		});
	}

	return (
		<>
			<ModalWrapper visible={joining} setVisible={setJoining} fullHeight={true}>
				<JoinPartyPage setVisible={setJoining} />
			</ModalWrapper>

			<View style={styles.createJoinContainer}>
				<TouchableOpacity
					onPress={() => setJoining(true)}
					style={{
						...ButtonStyles.secondary,
						...ButtonStyles.buttonLarge,
						flex: 1,
					}}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Join Party</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => createEvent()}
					style={{
						...ButtonStyles.primary,
						...ButtonStyles.buttonLarge,
						flex: 1,
					}}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Create Party</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
const styles = StyleSheet.create({
	createJoinContainer: {
		position: "absolute",
		zIndex: 50,
		bottom: 30,
		left: 0,
		right: 0,
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 2.5,
		...GlobalStyles.Container,
		shadowColor: Colors.secondary,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 5,
		flex: 0,
	},
});
