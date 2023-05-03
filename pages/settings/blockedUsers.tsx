import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import {
	SafeAreaView,
	Text,
	View,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import blockApi from "../../api/user/block";
import UserCard from "../../components/userCard";
export default function BlockedUsersPage({}) {
	const [users, setUsers] = useState([]);
	async function getBlockedUsers() {
		const response = await blockApi.getBlocks({ page: 1 });
		if (response.ok) {
			// @ts-expect-error
			setUsers(response.data);
		} else {
		}
	}
	async function unBlock(id: string) {
		const response = await blockApi.deleteBlocks({ userId: id });
		if (response.ok) {
			Alert.alert("User Unblocked", "Thank you for choosing peace");
		} else {
			Alert.alert(
				"Unblock unsuccessful",
				"Something went wrong, please try again later"
			);
		}
	}
	useEffect(() => {
		getBlockedUsers();
	}, []);

	return (
		<SafeAreaView>
			<Header goBack title={"Blocked Users"} />
			<View style={{ padding: 10 }}>
				<FlatList
					data={users}
					renderItem={({ item }) => (
						<UserCard
							profilePicture={item.src}
							name={item.blocked.name}
							username={item.blocked.username}
							id={item.blocked._id}
							// rightElement={
							// 	<TouchableOpacity onPress={() => unBlock()}>
							// 		<Text>Unblock</Text>
							// 	</TouchableOpacity>
							// }
						/>
					)}
				/>
			</View>
		</SafeAreaView>
	);
}
