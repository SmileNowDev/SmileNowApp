import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
} from "react-native";
import Header from "../components/layout/header";
import { Colors, Fonts } from "../styles/theme";
import { Camera } from "expo-camera";
import { ButtonStyles, Dim } from "../styles/styles";
import eventApi from "../api/post/event";
import attendeeApi from "../api/post/attendee";
import { BarCodeScanner } from "expo-barcode-scanner";
export default function JoinPartyPage({ navigation }) {
	const [joinCode, setJoinCode] = useState("");

	async function joinEvent(joinCode: string) {
		const result = await attendeeApi.join({ code: joinCode });
		console.log({ result });
		if (result.ok) {
			//@ts-expect-error
			navigation.navigate("Party", { eventId: result.data.event });
		}
	}
	const [hasPermission, setHasPermission] = useState<Boolean | null>(null);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		};

		getBarCodeScannerPermissions();
	}, []);

	const handleBarCodeScanned = ({ type, data }) => {
		setScanned(true);
		setJoinCode(data);
		joinEvent(data);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}
	return (
		<SafeAreaView style={{ flex: 1, height: Dim.height, position: "relative" }}>
			<Header goBack title={"Join Party"} />
			<View style={{ padding: 10, alignItems: "center" }}>
				<Text>Enter the join code</Text>
				<TextInput
					value={joinCode}
					placeholder="Code"
					onChangeText={setJoinCode}
					style={{
						fontSize: 40,
						fontFamily: Fonts.title.fontFamily,
						borderBottomWidth: 3,
						borderBottomColor: Colors.primary,
						borderStyle: "solid",
						color: Colors.primary,
					}}
					onSubmitEditing={() => joinEvent(joinCode)}
				/>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={{
						width: Dim.width - 60,
						height: Dim.width - 60,
						borderRadius: 20,
						overflow: "hidden",
						marginVertical: 20,
					}}
				/>

				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
						color: Colors.textSecondary,
					}}>
					Or Scan the QR Code
				</Text>
				{joinCode.length === 4 ? (
					<TouchableOpacity
						onPress={() => joinEvent(joinCode)}
						style={{
							marginTop: 50,
							...ButtonStyles.buttonLarge,
							...ButtonStyles.primary,
						}}>
						<Text style={{ ...ButtonStyles.buttonTextLarge }}>
							Join With Code
						</Text>
					</TouchableOpacity>
				) : null}
			</View>
		</SafeAreaView>
	);
}
