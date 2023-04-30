import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Icon from "../components/icons";
import { Colors, Fonts } from "../styles/theme";
import Header from "../components/header";
import { ButtonStyles, GlobalStyles } from "../styles/styles";
import PartyListItem from "../components/partyListItem";
export default function HomePage({ navigation }) {
	const [creatingParty, setCreatingParty] = useState(false);
	const [joiningParty, setJoiningParty] = useState(false);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Header navigation={navigation} />
			<Text
				style={{
					fontFamily: Fonts.title.fontFamily,
					fontSize: Fonts.subTitle.fontSize,
				}}>
				My Parties
			</Text>

			<PartyListItem icon={"🥰"} name={"SmileNow Hackathon"} canPost={true} />
			<PartyListItem icon={"🐸"} name={"Frog Party"} canPost={false} />
			<View
				style={{
					position: "absolute",
					bottom: 30,
					left: 15,
					right: 15,
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 2.5,
					...GlobalStyles.Container,

					flex: 0,
				}}>
				<TouchableOpacity
					onPress={() => setJoiningParty(true)}
					style={{ ...ButtonStyles.secondary, ...ButtonStyles.buttonLarge }}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Join Party</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setCreatingParty(true)}
					style={{ ...ButtonStyles.primary, ...ButtonStyles.buttonLarge }}>
					<Text style={{ ...ButtonStyles.buttonTextLarge }}>Create Party</Text>
				</TouchableOpacity>
			</View>
			{/* list of parties you've been to */}
		</SafeAreaView>
	);
}
