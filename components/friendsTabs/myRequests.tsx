import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import friendApi from "../../api/user/friend";
import UserCard from "../userCard";
import ScreenWrapper from "../core/screenWrapper";
export default function RequestsTab(params) {
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1); // Add this state
	const [hasMore, setHasMore] = useState(true); // Add this state
	const [loading, setLoading] = useState(false); // Add this state
	const [bottomLoading, setBottomLoading] = useState(false);
	async function getList() {
		const result = await friendApi.getRequestingMe({ page: 1 });
		if (result.ok) {
			//@ts-expect-error
			setList(result.data);
		}
	}
	async function loadMore() {
		if (!hasMore) {
			return;
		}

		setBottomLoading(true);
		const nextPage = page + 1;
		const result = await friendApi.getRequestingMe({ page: nextPage });

		if (result.ok) {
			// @ts-expect-error
			if (result.data.length > 0) {
				//@ts-expect-error
				setList((prevEvents) => [...prevEvents, ...result.data]);
				setPage(nextPage);
			} else {
				setHasMore(false);
			}
		}

		setBottomLoading(false);
	}
	useEffect(() => {
		getList();
	}, []);
	return (
		<ScreenWrapper
			style={GlobalStyles.tabScreenContainer}
			onRefresh={getList}
			scrollEnabled={true}
			loading={loading}
			onBottomScroll={loadMore}
			bottomLoading={bottomLoading}
		>
			<Text style={GlobalStyles.tabScreenTitle}>Requesting Me</Text>
			{list.map(function (item, index) {
				return (
					<UserCard
						profilePicture={item.src}
						name={item.requester.name}
						username={item.requester.username}
						id={item.requester._id}
					/>
				);
			})}
		</ScreenWrapper>
	);
}
