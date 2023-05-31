import { ButtonStyles, GlobalStyles } from "../../styles/styles";
import JoinPartyPage from "../../pages/joinParty";
import ModalWrapper from "../core/modalWrapper";
import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import eventApi from "../../api/post/event";
import { Colors } from "../../styles/theme";
export default function CreateJoin({ navigation }) {
	const [joining, setJoining] = useState(false);
	async function createEvent() {
		const result = await eventApi.create();
		if (result.ok) {
			navigation.navigate("Party", {
				// @ts-expect-error
				eventId: result.data._id,
				justCreated: true,
			});
		}
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
					onPress={createEvent}
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
