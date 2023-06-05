import React, { useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import friendApi from "../../api/user/friend";
import UserCard from "../userCard";
import ScreenWrapper from "../core/screenWrapper";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Colors } from "../../styles/theme";
export default function RequestsSentTab() {
	const [page, setPage] = useState(1);

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
		queryKey: ["my_requests_sent"],
		queryFn: getList,
		getNextPageParam: (lastPage) => {
			return hasNextPage ? page + 1 : undefined;
		},
	});
	async function getList({ pageParam = 1 }) {
		setPage(pageParam);
		const result = await friendApi.getMyRequests({ page: 1 });
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
			scrollEnabled={true}
			onRefresh={refetch}
			onBottomScroll={fetchNextPage}
			bottomLoading={isFetchingNextPage}>
			<Text style={GlobalStyles.tabScreenTitle}>Requests Sent</Text>
			{data.pages.flat().length == 0 ? (
				<View>
					<Text>You haven't sent any requests</Text>
					<Text>Don't be shy, tap a person's profile and say hi!</Text>
				</View>
			) : (
				<FlatList
					style={{ padding: 10 }}
					data={data.pages.flat()}
					scrollEnabled={false}
					keyExtractor={(item) => item._id}
					renderItem={({ item }) => {
						console.log(item);

						return (
							<UserCard
								profilePicture={item.recipient.src}
								name={item.recipient.name}
								username={item.recipient.username}
								id={item.recipient._id}
							/>
						);
					}}
					onEndReachedThreshold={0.5}
				/>
			)}
		</ScreenWrapper>
	);
}
