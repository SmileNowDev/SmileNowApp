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
export const imageWidth = Dim.width - 50;
export const imageHeight = imageWidth + 100;
export default function PostPage({ route }) {
	const { postId } = route.params;
	const [post, setPost] = useState<any>();

	const [refreshing, setRefreshing] = useState(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [bottomLoading, setBottomLoading] = useState(false);
	const [editing, setEditing] = useState(false);
	const [caption, setCaption] = useState("");
	const { userId } = useContext(Context);

	async function getPost() {
		setLoading(true);

		const result = await postApi.getPost({ postId });
		if (result.ok) {
			setPost(result.data);
			// @ts-expect-error
			setCaption(result.data.caption);
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
							caption={caption}
							owner={{
								name: post?.user.name,
								picture: post?.user.src,
								id: post?.user._id,
							}}
							date={post?.createdAt}
							likes={post?.likes}
							isLiked={post?.isLiked}
							comments={post?.comments}
							refresh={onRefresh}
							delay={0}
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
							marginTop: 5,
						}}>
						<TextInput
							numberOfLines={2}
							style={{
								...GlobalStyles.textInput,
								paddingVertical: 6,
								flex: 1,
								height: 50,
							}}
							placeholderTextColor={Colors.textSecondary}
							placeholder="Leave a comment here"
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
