import { ButtonStyles, Dim, GlobalStyles } from "../../styles/styles";
import JoinPartyPage from "../../pages/joinParty";
import ModalWrapper from "../core/modalWrapper";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import eventApi from "../../api/post/event";
import { Colors, Fonts } from "../../styles/theme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
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
			<LinearGradient
				colors={["transparent", Colors.textSecondary]}
				locations={[0.1, 1]}
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: Dim.height * 0.25,
					zIndex: 40,
				}}
			/>
			<LinearGradient
				style={styles.createJoinContainer}
				colors={[
					Colors.foreground,
					Colors.background,
					Colors.background,
					Colors.textSecondary,
				]}
				locations={[0, 0.1, 0.8, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 1 }}>
				<TouchableOpacity
					onPress={() => setJoining(true)}
					style={{
						...ButtonStyles.secondary,
						...ButtonStyles.buttonLarge,
						shadowColor: Colors.primary,

						flex: 1,
					}}>
					<Text
						style={{
							...ButtonStyles.buttonTextLarge,
							textAlign: "center",
							fontWeight: "bold",
						}}>
						Join Party
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => createEvent()}
					style={{
						...ButtonStyles.primary,
						...ButtonStyles.buttonLarge,

						flex: 1,
					}}>
					<Text
						style={{
							...ButtonStyles.buttonTextLarge,
							textAlign: "center",
						}}>
						Create Party
					</Text>
				</TouchableOpacity>
			</LinearGradient>
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
		paddingVertical: 12,
		...GlobalStyles.Container,
		shadowColor: Colors.text,
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.5,
		shadowRadius: 10,
		elevation: 5,
		flex: 0,
		borderColor: "transparent",
	},
});
