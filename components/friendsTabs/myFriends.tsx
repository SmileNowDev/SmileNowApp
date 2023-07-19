import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import friendApi from "../../api/user/friend";
import UserCard from "../userCard";
import ScreenWrapper from "../core/screenWrapper";
import { Context } from "../../providers/provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Colors, Fonts } from "../../styles/theme";
export default function MyFriendsTab() {
	const [friends, setFriends] = useState([]);
	const { userId } = useContext(Context);
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
		queryFn: getList,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.hasNextPage ? allPages.length + 1 : false;
		},
	});
	async function getList({ pageParam = 1 }) {
		const result = await friendApi.getMyFriends({ page: 1 });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			// @ts-expect-error
			console.log("Friends", result.data.data);
			return {
				// @ts-expect-error
				friends: result.data.data,
				// @ts-expect-error
				hasNextPage: result.data.next,
			};
		}
	}
	useEffect(() => {
		if (data) {
			let _friends = data.pages.flat()[0].friends;
			setFriends(_friends);
		}
	}, [data]);

	if (isLoading) {
		return (
			<View
				style={{ flex: 0.75, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" color={Colors.primary} />
			</View>
		);
	}
	return (
		<ScreenWrapper
			style={GlobalStyles.tabScreenContainer}
			onRefresh={refetch}
			scrollEnabled={true}
			loading={isLoading}
			onBottomScroll={fetchNextPage}
			bottomLoading={isFetchingNextPage}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingRight: 10,
					paddingTop: 10,
				}}>
				<Text style={{ ...GlobalStyles.tabScreenTitle, paddingTop: 0 }}>
					My Friends
				</Text>
				{isRefetching ? <ActivityIndicator size="small" /> : <></>}
			</View>
			{friends.length === 0 ? (
				<View style={{ margin: 15, paddingTop: 20 }}>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize + 2,
							color: Colors.textSecondary,
						}}>
						No Friend Requests
					</Text>
					<Text
						style={{
							fontFamily: Fonts.body.fontFamily,
							fontSize: Fonts.body.fontSize,
						}}>
						Looks like you're already everyone's friend 🥹
					</Text>
				</View>
			) : (
				<>
					<FlatList
						style={{ padding: 10 }}
						data={friends}
						renderItem={({ item }) => {
							if (item.recipient._id === userId) {
								return (
									<UserCard
										profilePicture={item.src}
										name={item.requester.name}
										username={item.requester.username}
										id={item.requester._id}
									/>
								);
							} else {
								return (
									<UserCard
										profilePicture={item.src}
										name={item.recipient.name}
										username={item.recipient.username}
										id={item.recipient._id}
									/>
								);
							}
						}}
						keyExtractor={(item) => {
							if (item.recipient._id === userId) {
								return item.requester._id;
							} else {
								return item.recipient._id;
							}
						}}
						onEndReached={() => {
							if (hasNextPage) {
								fetchNextPage();
							}
						}}
						onEndReachedThreshold={0.25}
					/>
				</>
			)}
		</ScreenWrapper>
	);
}
