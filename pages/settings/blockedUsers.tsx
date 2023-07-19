import React, { useEffect, useState } from "react";
import Header from "../../components/layout/header";
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
import { hashQueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { Colors, Fonts } from "../../styles/theme";
export default function BlockedUsersPage({}) {
	const [blockedUsers, setBlockedUsers] = useState([]);
	const {
		data,
		isLoading,
		refetch,
		isRefetching,
		status,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery<any>({
		queryKey: ["my_friends"],
		queryFn: ({ pageParam = 1 }) => getBlockedUsers({ pageParam }),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.hasNextPage ? allPages.length + 1 : false;
		},
	});
	async function getBlockedUsers({ pageParam }) {
		const result = await blockApi.getBlocks({ page: pageParam });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			return {
				// @ts-expect-error
				blockedUsers: result.data.data,
				// @ts-expect-error`
				hasNextPage: result.data.next,
			};
		}
	}
	useEffect(() => {
		if (data) {
			let _blocked = data.pages.flat()[0].blockedUsers as any[];
			setBlockedUsers(_blocked);
		}
	});
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

	return (
		<SafeAreaView>
			<Header goBack title={"Blocked Users"} />
			<View style={{ padding: 10 }}>
				{blockedUsers.length === 0 ? (
					<View>
						<Text
							style={{
								fontSize: Fonts.body.fontSize,
								fontFamily: Fonts.body.fontFamily,
								color: Colors.textSecondary,
							}}>
							You haven't blocked anyone yet, nice job!
						</Text>
						<Text
							style={{
								marginTop: 5,
								fontSize: Fonts.small.fontSize,
								fontFamily: Fonts.small.fontFamily,
								color: Colors.text,
							}}>
							If you need to, you can do it by tapping on their profile picture
						</Text>
					</View>
				) : (
					<FlatList
						data={blockedUsers}
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
				)}
			</View>
		</SafeAreaView>
	);
}
