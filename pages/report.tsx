import React, { useState } from "react";
import { Colors, Fonts } from "../styles/theme";
import { GlobalStyles, Dim } from "../styles/styles";
import reportApi from "../api/interaction/report";
import Header from "../components/layout/header";
import { View, SafeAreaView, TextInput, Alert } from "react-native";
import { Button, Text } from "../components/SmileNowUI";
export default function ReportPage({ route, navigation }) {
	const { type, id } = route.params;
	const [message, setMessage] = useState("");
	async function report() {
		let body = {};
		if (type == "post") {
			body = {
				post: id,
				message,
			};
		} else if (type == "comment") {
			body = {
				comment: id,
				message,
			};
		} else {
			body = {
				user: id,
				message,
			};
		}
		let result = await reportApi.create(body as any);
		if (result) {
			Alert.alert(
				"Report Submitted, we'll review it and take action if necessary"
			);
			navigation.goBack();
		}
	}
	return (
		<SafeAreaView>
			<Header goBack title="Report" />
			<View style={{ padding: 10 }}>
				<Text>Why are you reporting this {type}</Text>
				<TextInput
					placeholderTextColor={Colors.textSecondary}
					style={{
						...GlobalStyles.textInput,
						marginTop: 10,
						width: Dim.width - 20,
						height: 100,
					}}
					multiline
					placeholder="Give us a brief description of the issue..."
					value={message}
					onChangeText={setMessage}
				/>
				<Button onPress={() => report()} style={{ flex: 0.75, marginTop: 10 }}>
					Submit
				</Button>
			</View>
		</SafeAreaView>
	);
}
