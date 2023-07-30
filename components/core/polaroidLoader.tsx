import { LinearGradient } from "expo-linear-gradient";
import { imageHeight, imageWidth } from "../../pages/post";
import React, { useEffect } from "react";
import { Animated } from "react-native";
import { Colors } from "../../styles/theme";

export default function PolaroidLoader({ loading }) {
	const loaderOpacity = new Animated.Value(0);
	const loaderOffsetX = new Animated.Value(-2 * imageWidth);
	Animated.loop(
		Animated.timing(loaderOffsetX, {
			toValue: 2 * imageWidth,
			duration: 1000,
			useNativeDriver: true,
		})
	).start();
	useEffect(() => {
		if (!loading) {
			Animated.timing(loaderOpacity, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}).start();
		}
	}, [loading]);
	const backgroundColor = loaderOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: ["rgba(40, 40, 40, 1)", "rgba(40, 40, 40, 0)"], // Light gray to transparent
	});
	if (loading) {
		return (
			<>
				<Animated.View
					style={{
						height: imageHeight,
						width: imageWidth,
						backgroundColor,
						position: "absolute",
						borderRadius: 5,
						zIndex: 100,
						overflow: "hidden",
					}}>
					<Animated.View
						style={{
							height: imageHeight * 3,
							width: imageWidth - 15,
							transform: [{ rotate: "45deg" }, { translateX: loaderOffsetX }],
						}}>
						<LinearGradient
							colors={[
								Colors.textSecondary + "00",
								Colors.textSecondary + "80",
								Colors.textSecondary + "00",
							]}
							style={{ height: "100%", width: "100%" }}></LinearGradient>
					</Animated.View>
				</Animated.View>
			</>
		);
	}
	return <></>;
}
