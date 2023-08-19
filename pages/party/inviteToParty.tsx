import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { ButtonStyles, Dim, GlobalStyles } from "../../styles/styles";
import QRCode from "react-native-qrcode-svg";
import { Colors, Fonts } from "../../styles/theme";
import Header from "../../components/layout/header";
import eventApi from "../../api/post/event";
import ScreenWrapper from "../../components/core/screenWrapper";
import ModalWrapper from "../../components/core/modalWrapper";
import InvitePoster from "../../components/party/engagement/invitePoster";
import Icon from "../../components/core/icons";
export default function InviteToParty({ route, navigation }) {
	const { eventId } = route.params;
	const [joinCode, setJoinCode] = useState("ABCDE");
	const [name, setName] = useState("");
	const [posterVisible, setPosterVisible] = useState(false);
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
		<SafeAreaView style={{ alignItems: "center", flex: 1 }}>
			<ModalWrapper
				visible={posterVisible}
				setVisible={setPosterVisible}
				type="center">
				<TouchableOpacity
					style={{
						position: "absolute",
						top: 10,
						right: 10,
						zIndex: 100,
					}}
					onPress={() => {
						setPosterVisible(false);
					}}>
					<Icon name="close" size={30} />
				</TouchableOpacity>
				<InvitePoster code={joinCode} name={name} />
			</ModalWrapper>
			<Header goBack title={`Invite to ${name}`} />
			<ScreenWrapper
				onRefresh={() => {
					getEvent();
				}}
				style={{ width: "100%", backgroundColor: "white" }}
				scrollEnabled={false}
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
				</View>

				<TouchableOpacity
					onPress={() => setPosterVisible(true)}
					style={{
						...ButtonStyles.buttonLarge,
						...ButtonStyles.primary,
						marginHorizontal: 20,
					}}>
					<Text
						style={{
							...ButtonStyles.buttonTextLarge,
						}}>
						Create a Printable Invite Poster
					</Text>
				</TouchableOpacity>
			</ScreenWrapper>
		</SafeAreaView>
	);
}
