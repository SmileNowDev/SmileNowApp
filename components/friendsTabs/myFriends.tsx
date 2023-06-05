import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import friendApi from "../../api/user/friend";
import UserCard from "../userCard";
import ScreenWrapper from "../core/screenWrapper";
import { Context } from "../../providers/provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Colors } from "../../styles/theme";
export default function MyFriendsTab() {
	const [page, setPage] = useState(1);

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
		getNextPageParam: (lastPage) => {
			return hasNextPage ? page + 1 : undefined;
		},
	});
	async function getList({ pageParam = 1 }) {
		setPage(pageParam);
		const result = await friendApi.getMyFriends({ page: 1 });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			return result.data;
		}
	}

	if (isLoading || isRefetching) {
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
			<Text style={GlobalStyles.tabScreenTitle}>My Friends</Text>
			<FlatList
				style={{ padding: 10 }}
				data={data.pages.flat()}
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
			/>
		</ScreenWrapper>
	);
}
