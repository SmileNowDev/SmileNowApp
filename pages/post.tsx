import React, { useEffect, useState } from "react";
import {
	FlatList,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Header from "../components/header";
import postApi from "../api/post/post";
import Photo, { PhotoProps } from "../components/photo";
import commentApi from "../api/interaction/comment";
import Icon from "../components/icons";
import { Colors } from "../styles/theme";
import { Dim, GlobalStyles } from "../styles/styles";

export default function PostPage({ route, navigation }) {
	const { postId } = route.params;
	const [post, setPost] = useState<any>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState([]);
	async function getPost() {
		const result = await postApi.getPost({ postId });
		// console.log("post: ", result.data);
		if (result.ok) {
			setPost(result.data);
		}
	}
	async function getComments() {
		const result = await commentApi.getComments({ postId, page: 1 });
		console.log("data: ", result);
		if (result.ok) {
			//@ts-expect-error
			setComments(result.data);
		}
	}
	async function handleComment() {
		const result = await commentApi.create({ postId, text: comment });
		if (result.ok) {
			setComment("");
			await getComments();
		}
	}
	async function onRefresh() {
		setRefreshing(true);
		await getPost();
		await getComments();
		setRefreshing(false);
	}
	useEffect(() => {
		console.log("postId: ", postId);
		setLoading(true);
		getPost();
		getComments();
		setLoading(false);
	}, []);
	if (!loading) {
		return (
			<SafeAreaView>
				<Header goBack />
				<ScrollView
					style={{ padding: 10 }}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}>
					<Photo
						postId={postId}
						image={post?.src}
						caption={post?.caption}
						owner={{ name: post?.user.name, picture: post?.user.src }}
						date={post?.date}
						likes={post?.likes}
						isLiked={post?.isLiked}
						comments={post?.comments}
						refresh={onRefresh}
					/>
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
					{/* <FlatList
						data={comments}
						renderItem={({ item }) => <Text>{item.text}</Text>}
					/> */}
					<View style={{ height: Dim.height / 2 }}></View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}
