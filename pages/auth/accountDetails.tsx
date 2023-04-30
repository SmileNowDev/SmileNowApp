import React, { useContext } from "react";
import { useState } from "react";
import {
	Button,
	Image,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Colors, Fonts } from "../../styles/theme";
import { Context } from "../../providers/provider";
import { ButtonStyles, GlobalStyles } from "../../styles/styles";
export default function AccountDetailsScreen({ navigation }) {
	const { setLoggedIn } = useContext(Context);
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	function handleNext() {
		setLoggedIn(true);
		navigation.navigate("Home");
	}
	return (
		<SafeAreaView
			style={{
				backgroundColor: Colors.primary,
				flex: 1,
				display: "flex",
				alignItems: "center",
			}}>
			<View style={GlobalStyles.ScreenContainer}>
				<TouchableOpacity
					style={{ padding: 50 }}
					onPress={() => {
						navigation.navigate("TakeProfilePicture");
					}}>
					<Text>Take a profile Picture</Text>
				</TouchableOpacity>

				<TextInput
					placeholder="Name"
					onChangeText={setName}
					placeholderTextColor={Colors.border}
					style={{
						width: "100%",
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: Colors.background,
						borderRadius: 5,
						paddingVertical: 10,
						paddingHorizontal: 10,
						fontSize: 20,
						color: Colors.background,
					}}
				/>
				<TextInput
					placeholder="username"
					onChangeText={setUsername}
					placeholderTextColor={Colors.border}
					style={{
						width: "100%",
						borderWidth: 1,
						borderStyle: "solid",
						borderColor: Colors.background,
						borderRadius: 5,
						paddingVertical: 10,
						paddingHorizontal: 10,
						fontSize: 20,
						color: Colors.background,
						marginTop: 10,
					}}
				/>
				<Text style={{ color: Colors.foreground, textAlign: "center" }}>
					(hint: at least 5 characters)
				</Text>
				<TouchableOpacity
					onPress={handleNext}
					// disabled={name.length < 1 && username.length < 5}
					style={{
						...ButtonStyles.button,
						...ButtonStyles.outlinedWhite,
						opacity: name.length < 1 && username.length < 5 ? 0.5 : 1,
						marginTop: 40,
					}}>
					<Text style={{ color: Colors.background, fontSize: 20 }}>
						Complete Profile
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
