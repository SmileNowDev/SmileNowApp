import React, { useRef } from "react";
import { Animated, View } from "react-native";
import { Dim } from "../../styles/styles";
interface PostingIndicator {
	posting: boolean;
	donePosting: boolean;
}
export default function PostingIndicator({
	posting,
	donePosting,
}: PostingIndicator) {
	const animatedWidth = useRef(new Animated.Value(0)).current;
	if (!posting) {
		return <></>;
	} else {
		return (
			<View>
				<Animated.View
					style={{
						transform: [
							{
								translateY: animatedWidth.interpolate({
									inputRange: [0, 1],
									outputRange: [0, Dim.width - 20], // adjust this value to move as much as you need
								}),
							},
						],
					}}></Animated.View>
			</View>
		);
	}
}
