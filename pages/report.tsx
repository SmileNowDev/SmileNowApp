import React, { useState } from "react";
import { Colors, Fonts } from "../styles/theme";
import { GlobalStyles, ButtonStyles, Dim } from "../styles/styles";
import reportApi from "../api/interaction/report";
import Header from "../components/layout/header";
import {
	View,
	SafeAreaView,
	Text,
	TextInput,
	Alert,
	TouchableOpacity,
} from "react-native";
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
				<Text
					style={{
						fontFamily: Fonts.body.fontFamily,
						fontSize: Fonts.body.fontSize,
					}}>
					{" "}
					Why are you reporting this {type}
				</Text>
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
				<TouchableOpacity
					onPress={() => report()}
					style={{
						...ButtonStyles.buttonLarge,
						...ButtonStyles.primary,
					}}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Submit</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
