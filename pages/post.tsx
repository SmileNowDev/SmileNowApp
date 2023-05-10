import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import Header from "../components/layout/header";
import postApi from "../api/post/post";
import Photo, { PhotoProps } from "../components/post/photo";
import commentApi from "../api/interaction/comment";
import Icon from "../components/core/icons";
import { Colors } from "../styles/theme";
import { Dim, GlobalStyles } from "../styles/styles";
import Comment from "../components/post/comment";
import ScreenWrapper from "../components/core/screenWrapper";

export default function PostPage({ route, navigation }) {
	const { postId } = route.params;
	const [post, setPost] = useState<any>();

	const [refreshing, setRefreshing] = useState(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [page, setPage] = useState(1); // Add this state
	const [hasMore, setHasMore] = useState(true); // Add this state
	const [loading, setLoading] = useState(false); // Add this state
	const [bottomLoading, setBottomLoading] = useState(false);

	async function getPost() {
		setLoading(true);

		const result = await postApi.getPost({ postId });
		if (result.ok) {
			setPost(result.data);
		}
		setLoading(false);
	}
	async function getComments() {
		const result = await commentApi.getComments({ postId, page: 1 });
		if (result.ok) {
			//@ts-expect-error
			setComments(result.data);
		}
	}
	async function loadMore() {
		if (!hasMore) {
			return;
		}

		setBottomLoading(true);
		const nextPage = page + 1;
		const result = await commentApi.getComments({ postId, page: nextPage });

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
	async function handleComment() {
		if (!comment || comment.trim().length == 0) {
			Alert.alert("Comment cannot be empty");
		} else {
			const result = await commentApi.create({ postId, text: comment });
			if (result.ok) {
				setComment("");
				await getComments();
			}
		}
	}
	async function onRefresh() {
		setRefreshing(true);
		await getPost();
		await getComments();
		setRefreshing(false);
	}
	useEffect(() => {
		getPost();
		getComments();
	}, []);
	if (!loading) {
		return (
			<SafeAreaView>
				<Header goBack />
				<ScreenWrapper
					onRefresh={getComments}
					scrollEnabled={true}
					loading={loading}
					onBottomScroll={loadMore}
					bottomLoading={bottomLoading}
					keyboardShouldPersistTaps="handled">
					{!loading ? (
						<Photo
							postId={postId}
							image={post?.src}
							caption={post?.caption}
							owner={{
								name: post?.user.name,
								picture: post?.user.src,
								id: post?.user._id,
							}}
							date={post?.date}
							likes={post?.likes}
							isLiked={post?.isLiked}
							comments={post?.comments}
							refresh={onRefresh}
						/>
					) : (
						<ActivityIndicator />
					)}

					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<TextInput
							numberOfLines={2}
							style={{
								...GlobalStyles.textInput,
								paddingVertical: 6,
								flex: 1,
								height: 50,
							}}
							placeholder="Comment"
							value={comment}
							onChangeText={setComment}
						/>
						<TouchableOpacity
							onPress={() => handleComment()}
							style={{
								backgroundColor: Colors.primary,
								borderRadius: 5,
								height: 50,
								width: 50,
								justifyContent: "center",
								alignItems: "center",
								alignSelf: "flex-end",
								marginLeft: 10,
							}}>
							<Icon name="send" size={30} color={Colors.background} />
						</TouchableOpacity>
					</View>
					{/* Comments */}
					<FlatList
						data={comments}
						renderItem={({ item, index }) => (
							<View
								style={{
									backgroundColor:
										index % 2 == 0 ? Colors.background : Colors.foreground,
									marginVertical: 4,
									borderRadius: 10,
								}}>
								<Comment
									commentId={item._id}
									pic={item.user.src}
									name={item.user.name}
									comment={item.text}
									date={item.createdAt}
									userId={item.user._id}
								/>
							</View>
						)}
					/>
					<View style={{ height: Dim.height / 2 }}></View>
				</ScreenWrapper>
			</SafeAreaView>
		);
	}
}
