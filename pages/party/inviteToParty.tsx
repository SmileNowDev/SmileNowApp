import React, { useEffect, useState, useContext } from "react";
import {
	SafeAreaView,
	Text,
	View,
	ScrollView,
	FlatList,
	TouchableOpacity,
} from "react-native";
import { Dim, GlobalStyles } from "../../styles/styles";
import QRCode from "react-native-qrcode-svg";
import { Colors, Fonts } from "../../styles/theme";
import Header from "../../components/layout/header";
import eventApi from "../../api/post/event";
import attendeeApi from "../../api/post/attendee";
import UserCard from "../../components/userCard";
import ScreenWrapper from "../../components/core/screenWrapper";
import { ButtonStyles } from "../../styles/styles";
import { Context } from "../../providers/provider";
export default function InviteToParty({ route, navigation }) {
	const { eventId, isHost } = route.params;
	const { userId } = useContext(Context);
	const [joinCode, setJoinCode] = useState("ABCD");
	const [name, setName] = useState("");

	const [loading, setLoading] = useState(false); // Add this state

	async function getEvent() {
		setLoading(true);
		const result = await eventApi.getEvent({ eventId });
		if (result.ok) {
			//@ts-expect-error
			setName(result.data.event.title);
			//@ts-expect-error
			setJoinCode(result.data.event.inviteCode);
		}
		setLoading(false);
	}
	useEffect(() => {
		getEvent();
	}, [eventId]);

	return (
		<SafeAreaView style={{ alignItems: "center" }}>
			<Header goBack title={`Invite to ${name}`} />
			<ScreenWrapper
				onRefresh={() => {
					getEvent();
				}}
				style={{ width: "100%", backgroundColor: "white" }}
				scrollEnabled={true}
				loading={loading}>
				<View style={{ width: "100%", backgroundColor: "white" }}>
					<View
						style={{
							alignItems: "center",
							marginVertical: 20,
						}}>
						<Text
							style={{
								marginBottom: 10,
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
								marginBottom: 20,
							}}>
							{joinCode}
						</Text>
						<View
							style={{
								...GlobalStyles.Container,
								backgroundColor: Colors.background,
							}}>
							<QRCode value={joinCode} size={Dim.width - 60} />
						</View>
					</View>

					<View style={{ height: Dim.height / 2 }}></View>
				</View>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
