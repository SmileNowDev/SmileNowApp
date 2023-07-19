import { imageHeight, imageWidth } from "../../pages/post";
import React, { useEffect, useRef } from "react";
import { Animated, Image, TouchableOpacity, View } from "react-native";
import { GlobalStyles } from "../../styles/styles";
import { Colors } from "../../styles/theme";
import { useNavigation } from "@react-navigation/native";
import Photo from "../../components/post/photo";

export default function NewPosts({ posts, doneLoading, eventId }) {
	const navigation = useNavigation();

	function NewPost({ post, key, delay }) {
		const opacity = useRef(new Animated.Value(1)).current;

		const offset = useRef(new Animated.Value(0)).current;

		function handleAnimation() {
			if (doneLoading) {
				Animated.parallel([
					Animated.timing(offset, {
						toValue: 1,
						duration: 2000,
						useNativeDriver: false,
					}),
					Animated.timing(opacity, {
						toValue: 0,
						duration: 4000,
						useNativeDriver: false,
						delay: 1000,
					}),
				]).start();
			} else {
				offset.setValue(0);
				opacity.setValue(1);
			}
		}
		useEffect(() => handleAnimation, []);

		return (
			<Animated.View
				style={{
					marginTop: 20,
					backgroundColor: Colors.background,
					alignItems: "center",
					padding: 10,
					borderRadius: 3.5,
					...GlobalStyles.shadow,

					transform: [
						{
							translateY: offset.interpolate({
								inputRange: [0, 1],
								outputRange: [-imageHeight * 1.5, 0], // adjust this value to move as much as you need
							}),
						},
					],
				}}>
				<Animated.View
					style={{
						marginTop: 20,
						backgroundColor: Colors.background,
						alignItems: "center",
						padding: 10,
						borderRadius: 3.5,
						...GlobalStyles.shadow,

						transform: [
							{
								translateY: offset.interpolate({
									inputRange: [0, 1],
									outputRange: [-imageHeight * 1.5, 0], // adjust this value to move as much as you need
								}),
							},
						],
					}}>
					<View
						style={{
							height: imageHeight,
							width: imageWidth,
							borderRadius: 5,
							position: "relative",
							overflow: "hidden",
						}}>
						<Animated.View
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								zIndex: 100,
								borderRadius: 5,
								height: imageHeight,
								width: imageWidth,
								opacity: opacity,
								backgroundColor: "black",
							}}
						/>
						<TouchableOpacity
							delayPressIn={500}
							onPress={() => {
								// @ts-expect-error
								navigation.navigate("Post", {
									postId: post._id,
									eventId: eventId,
								});
							}}>
							<Photo
								postId={post._id}
								image={post.src}
								caption={post.caption}
								owner={{
									name: post.user.name,
									picture: post.user.src,
									id: post.user._id,
								}}
								date={post.createdAt}
								likes={post.likes || 0}
								isLiked={post.isLiked}
								comments={post.comments || 0}
								refresh={() => null}
							/>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</Animated.View>
		);
	}
	if (NewPosts.length === 0 || !doneLoading) {
		return <></>;
	} else
		return (
			<View>
				{posts.map((post, index) => {
					return <NewPost post={post} key={post._id} delay={index * 1000} />;
				})}
			</View>
		);
}
