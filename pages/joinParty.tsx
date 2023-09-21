import React, { useEffect, useState } from "react";
import { View, TextInput } from "react-native";
import { Colors, Fonts } from "../styles/theme";
import { Dim } from "../styles/styles";
import attendeeApi from "../api/post/attendee";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "../components/SmileNowUI";
export default function JoinPartyPage({ setVisible }) {
	const navigation = useNavigation();
	const [joinCode, setJoinCode] = useState("");

	async function joinEvent(joinCode: string) {
		const result = await attendeeApi.join({ code: joinCode });
		// console.log({ result });
		if (result.ok) {
			setVisible(false);
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
		<View style={{ position: "relative" }}>
			<View style={{ padding: 10, alignItems: "center" }}>
				<Text>Enter the join code</Text>
				<TextInput
					value={joinCode}
					placeholder="Code"
					placeholderTextColor={Colors.textSecondary + "50"}
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
				<Text
					colorScheme="textSecondary"
					style={{
						marginTop: 10,
					}}>
					Or Scan the QR Code
				</Text>
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={{
						width: Dim.width - 60,
						height: Dim.width - 60,
						borderRadius: 20,
						overflow: "hidden",
					}}
				/>
			</View>
			{joinCode.length === 4 ? (
				<View
					style={{
						position: "absolute",
						left: 10,
						right: 10,
						bottom: -30,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Button
						size="xl"
						onPress={() => joinEvent(joinCode)}
						style={{ flex: 1 }}>
						Join With Code
					</Button>
				</View>
			) : null}
		</View>
	);
}
