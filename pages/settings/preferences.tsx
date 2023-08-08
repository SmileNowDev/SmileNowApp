import React, { useEffect, useState } from "react";
import Header from "../../components/layout/header";
import {
	SafeAreaView,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Alert,
	Switch,
} from "react-native";
import SettingButton from "../../components/settings/settingsButton";
import blockApi from "../../api/user/block";
import UserCard from "../../components/userCard";
import { hashQueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { Colors, Fonts } from "../../styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "../../components/core/icons";
export default function Preferences({}) {
	function ShowHideTutorials() {
		const [showTutorials, setShowTutorials] = useState(false);
		useEffect(() => {
			AsyncStorage.getItem("showPartyTutorials").then((value) => {
				if (value) setShowTutorials(true);
				else setShowTutorials(false);
			});
		}, []);
		function toggleControls() {
			if (showTutorials) {
				AsyncStorage.removeItem("showPartyTutorials").then(() => {
					setShowTutorials(false);
					Alert.alert("Party hints will not be shown when you join a party!");
				});
			} else {
				AsyncStorage.setItem("showPartyTutorials", "true").then(() => {
					setShowTutorials(true);
					Alert.alert("Party hints will be shown when you join a party!");
				});
			}
		}
		return (
			<View>
				<SettingButton
					text={"Show Party Hints"}
					rightElement={
						<Switch value={showTutorials} onChange={toggleControls} />
					}
					onPress={toggleControls}
					icon={<Icon name="help" />}
				/>
			</View>
		);
	}
	return (
		<SafeAreaView>
			<Header goBack title={"Blocked Users"} />
			<ShowHideTutorials />
		</SafeAreaView>
	);
}
