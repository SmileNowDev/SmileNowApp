import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import { Dim } from "../styles/styles";
import QRCode from "react-native-qrcode-svg";
import { Colors, Fonts } from "../styles/theme";
import Header from "../components/header";
import eventApi from "../api/post/event";
export default function InviteToParty({ route, navigation }) {
	const { eventId } = route.params;

	const [joinCode, setJoinCode] = useState("ABCD");
	const [name, setName] = useState("");
	async function getEvent() {
		const result = await eventApi.getEvent({ eventId });
		if (result.ok) {
			//@ts-expect-error
			setName(result.data.event.title);
			//@ts-expect-error
			setJoinCode(result.data.event.inviteCode);
		}
	}
	useEffect(() => {
		getEvent();
	}, [eventId]);

	return (
		<SafeAreaView style={{ alignItems: "center" }}>
			<Header title={"Inviting Friends"} />
			<View
				style={{
					height: Dim.width - 60,
					width: Dim.width - 60,
					borderRadius: 20,
					marginVertical: 40,
				}}>
				<QRCode value={joinCode} size={Dim.width - 60} />
				{/* QR Code goes here*/}
			</View>
			<View>
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}>
					Tell friends to join with
				</Text>
				<Text
					style={{
						fontFamily: Fonts.title.fontFamily,
						fontSize: Fonts.title.fontSize + 10,
						color: Colors.primary,
						textAlign: "center",
					}}>
					{joinCode}
				</Text>
			</View>
		</SafeAreaView>
	);
}
