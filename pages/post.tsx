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
import Photo, { PhotoProps } from "../components/post/photo";
import commentApi from "../api/interaction/comment";
import Icon from "../components/core/icons";
import { Colors } from "../styles/theme";
import { ButtonStyles, Dim, GlobalStyles } from "../styles/styles";
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

	const [refreshing, setRefreshing] = useState(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [page, setPage] = useState<number>(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [bottomLoading, setBottomLoading] = useState(false);
	const [editing, setEditing] = useState(false);
	const [caption, setCaption] = useState("");
	const { userId } = useContext(Context);
	type PostType = {
		_id: string;
		src: string;
		caption: string;
		image: string;
		owner: {
			_id: string;
			name: string;
			picture: string;
		};
		date: string;
		likes: number;
		comments: number;
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
		console.log("fetching post");
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
			console.log("post", data);
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
			console.log("comments", result.data);
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
	async function onRefresh() {
		console.log("Refetching");
		setRefreshing(true);
		refetchPost();
		refetchComments();
		setRefreshing(false);
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
						post?.user._id === userId ? (
							<TouchableOpacity
								onPress={() => setEditing(true)}
								style={{
									...ButtonStyles.buttonSmall,
									...ButtonStyles.outlined,
								}}>
								<Icon name="edit" size={20} color={Colors.text} />
								<Text
									style={{
										...ButtonStyles.buttonText,
										color: Colors.text,
									}}>
									Edit
								</Text>
							</TouchableOpacity>
						) : null
					}
				/>
				<ScreenWrapper
					onRefresh={onRefresh}
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
						refresh={onRefresh}
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
						caption={caption}
						setCaption={setCaption}
						setVisible={setEditing}
					/>
				</ModalWrapper>
			</SafeAreaView>
		);
	}
}
