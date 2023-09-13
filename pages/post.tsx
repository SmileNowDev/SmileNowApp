import React, { useEffect, useState, useContext } from "react";
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
import Photo from "../components/post/photo";
import commentApi from "../api/interaction/comment";
import Icon from "../components/core/icons";
import { Colors } from "../styles/theme";
import { Dim, GlobalStyles } from "../styles/styles";
import Comment from "../components/post/comment";
import ScreenWrapper from "../components/core/screenWrapper";
import ModalWrapper from "../components/core/modalWrapper";
import EditCaption from "../components/post/editCaption";
import { Context } from "../providers/provider";
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { Button } from "../components/SmileNowUI/button";
export const imageWidth = Dim.width - 40;
export const imageHeight = imageWidth + 100;

type CommentType = {
	_id: string;
	text: string;
	user: {
		_id: string;
		name: string;
		src: string;
	};
	createdAt: string;
};

export default function PostPage({ route }) {
	const queryClient = useQueryClient();

	const { postId, eventId } = route.params;
	const [post, setPost] = useState<any>();

	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [page, setPage] = useState<number>(1);
	const [editing, setEditing] = useState(false);
	const [caption, setCaption] = useState("");
	const { userId } = useContext(Context);
	type PostType = {
		_id: string;
		src: string;
		caption: string;
		image: string;
		user: {
			_id: string;
			name: string;
			src: string;
		};
		date: string;
		likes: number;
		comments: number;
		createdAt: string;
		isLiked: boolean;
	};
	const {
		data: postData,
		refetch: refetchPost,
		isLoading: isPostLoading,
	} = useQuery<PostType>({
		queryKey: ["post", postId],
		queryFn: getPost,
	});

	async function getPost(): Promise<PostType> {
		const result = await postApi.getPost({ postId });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			const data: PostType = result.data as PostType;
			// if (
			// 	typeof data._id !== "number" ||
			// 	typeof data.caption !== "string" ||
			// 	typeof data.image !== "string" ||
			// 	typeof data.owner !== "object" ||
			// 	typeof data.date !== "string" ||
			// 	typeof data.likes !== "number" ||
			// 	typeof data.comments !== "number"
			// ) {
			// 	throw new Error("Invalid data");
			// }
			return data;
		}
	}
	const {
		data: commentData,
		isLoading: isCommentsLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch: refetchComments,
		status: commentStatus,
	} = useInfiniteQuery({
		queryKey: ["comments", postId, page],
		queryFn: getComments,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.hasNextPage ? allPages.length + 1 : false;
		},
	});
	async function getComments({ pageParam = 1 }) {
		setPage(pageParam);
		const result = await commentApi.getComments({ postId, page: 1 });
		if (!result.ok) {
			throw new Error(result.problem);
		} else {
			// @ts-expect-error
			return { comments: result.data.data, hasNextPage: result.data.next };
		}
	}
	useEffect(() => {
		if (commentData) {
			let _comments = commentData.pages.flat()[0].comments;
			setComments(_comments);
		}
	}, [commentData]);

	async function handleComment() {
		if (!comment || comment.trim().length == 0) {
			Alert.alert("Comment cannot be empty");
		} else {
			const result = await commentApi.create({ postId, text: comment });
			if (result.ok) {
				setComment("");
				refetchComments();
			}
		}
	}

	const allPagesData = queryClient.getQueryData(["posts", eventId]);
	// @ts-expect-error
	const cachedPostData = allPagesData?.pages
		.flat()
		.find((post) => post._id === postId);
	// console.log("Cached Post Data===============");
	// console.log(cachedPostData);
	// console.log("===============");
	useEffect(() => {
		//reconcile cached data with api data
		if (cachedPostData === undefined) {
			refetchPost();
		} else {
			queryClient.setQueryData(["post", postId], cachedPostData);
			setPost(cachedPostData);
		}
	}, [cachedPostData, postData]);

	if (!post && isPostLoading) {
		//todo: pretty loading screen
		return (
			<View style={{ flex: 1, justifyContent: "center" }}>
				<ActivityIndicator size={"large"} color={Colors.primary} />
			</View>
		);
	} else {
		return (
			<SafeAreaView>
				<Header
					goBack
					rightContent={
						postData?.user._id === userId ? (
							<Button
								size="sm"
								variant="outlined"
								colorScheme="gray"
								style={{
									position: "absolute",
									right: 0,
								}}
								onPress={() => setEditing(true)}
								leftIcon={
									<Icon name="edit" size={15} color={Colors.textSecondary} />
								}>
								Edit
							</Button>
						) : null
					}
				/>
				<ScreenWrapper
					onRefresh={() => {
						refetchPost();
						refetchComments();
					}}
					scrollEnabled={true}
					loading={isPostLoading}
					onBottomScroll={() => {
						if (hasNextPage) {
							fetchNextPage();
						}
					}}
					bottomLoading={isFetchingNextPage}
					keyboardShouldPersistTaps="handled">
					<Photo
						postId={postId}
						image={postData?.src}
						caption={postData?.caption}
						owner={{
							name: postData?.user.name,
							picture: postData?.user.src,
							id: postData?.user._id,
						}}
						date={postData?.createdAt}
						likes={postData?.likes}
						isLiked={postData?.isLiked}
						comments={postData?.comments}
						refresh={refetchPost}
					/>

					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							...GlobalStyles.textInput,
							paddingRight: 0,
							paddingLeft: 15,
							paddingVertical: 6,
							flex: 1,
							height: 40,
							borderRadius: 50,
							marginTop: 20,
						}}>
						<TextInput
							numberOfLines={2}
							style={{ flex: 1 }}
							placeholderTextColor={Colors.textSecondary}
							placeholder="Leave a comment here"
							value={comment}
							onChangeText={setComment}
						/>
						<TouchableOpacity
							onPress={() => handleComment()}
							style={{
								backgroundColor: Colors.primary,
								borderRadius: 25,
								height: 40,
								width: 40,
								justifyContent: "center",
								alignItems: "center",
								marginLeft: 10,
							}}>
							<Icon name="send" size={25} color={Colors.background} />
						</TouchableOpacity>
					</View>
					{/* Comments */}
					{isCommentsLoading ? (
						<ActivityIndicator size="large" color={Colors.primary} />
					) : (
						<FlatList
							data={comments}
							renderItem={({ item, index }) => {
								let comment = item as CommentType;
								return (
									<View
										style={{
											backgroundColor:
												index % 2 == 0 ? Colors.background : Colors.foreground,
											marginVertical: 4,
											borderRadius: 10,
										}}>
										<Comment
											commentId={comment._id}
											pic={comment.user.src}
											name={comment.user.name}
											comment={comment.text}
											date={comment.createdAt}
											userId={comment.user._id}
										/>
									</View>
								);
							}}
							onEndReached={() => {
								if (hasNextPage) {
									fetchNextPage();
								}
							}}
							onEndReachedThreshold={0.25}
						/>
					)}

					<View style={{ height: Dim.height / 2 }}></View>
				</ScreenWrapper>
				<ModalWrapper
					visible={editing}
					setVisible={setEditing}
					fullHeight={true}>
					<EditCaption
						postId={postId}
						caption={postData.caption}
						refresh={refetchPost}
						setVisible={setEditing}
					/>
				</ModalWrapper>
			</SafeAreaView>
		);
	}
}
