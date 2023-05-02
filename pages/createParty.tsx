import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import Header from "../components/header";
import { ButtonStyles, Dim, GlobalStyles } from "../styles/styles";
import { Colors, Fonts } from "../styles/theme";
import Icon from "../components/icons";
import eventApi from "../api/post/event";
import QRCode from "react-native-qrcode-svg";

export default function CreatePartyPage({ route, navigation }) {
	const [joinCode, setJoinCode] = useState("ABCD");
	const { eventId } = route.params;
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
		<SafeAreaView>
			<Header goBack title={"Your Party Has Been Created!"} />
			<ScrollView>
				<View style={{ alignItems: "center", gap: 20, paddingTop: 20 }}>
					<View>
						<Text
							style={{
								fontFamily: Fonts.small.fontFamily,
								fontSize: Fonts.small.fontSize,
								color: Colors.textSecondary,
							}}>
							What's the name of your event?
						</Text>
						<TextInput
							style={{
								...GlobalStyles.textInput,
								fontSize: 20,
								width: Dim.width - 40,
							}}
							value={name}
							onChangeText={setName}
							autoFocus={true}
							placeholder="Party Name"
						/>
					</View>

					<View
						style={{
							height: Dim.width - 40,
							width: Dim.width - 40,
							borderRadius: 20,
							backgroundColor: "gray",
						}}>
						<QRCode value={joinCode} size={Dim.width - 40} />
						{/* QR Code goes here*/}
					</View>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
							color: Colors.textSecondary,
						}}>
						(Use the QR scanner in the app)
					</Text>
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
					<TouchableOpacity
						onPress={() => navigation.navigate("Camera", { eventId })}
						style={{
							...ButtonStyles.buttonLarge,
							...ButtonStyles.primary,
						}}>
						<Icon name="camera" size={20} type="Feather" color="white" />
						<Text style={{ ...ButtonStyles.buttonTextLarge }}>
							Take the First Picture
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => navigation.navigate("Party", { eventId })}>
						<Text style={{ ...ButtonStyles.buttonText, color: Colors.text }}>
							Skip to Party
						</Text>
					</TouchableOpacity>
				</View>
				<View style={{ height: 400 }}></View>
			</ScrollView>
		</SafeAreaView>
	);
}
