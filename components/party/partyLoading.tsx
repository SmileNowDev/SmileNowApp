import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { Animated, Image, View, Easing, StyleSheet } from "react-native";
import { Dim } from "../../styles/styles";
import { Colors } from "../../styles/theme";
import { LinearGradient } from "expo-linear-gradient";
export default function PartyLoading() {
	const rotation = new Animated.Value(0);
	Animated.loop(
		Animated.timing(rotation, {
			toValue: 1,
			duration: 1000,
			easing: Easing.linear,
			useNativeDriver: true,
		})
	).start();
	const spin = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});
	const reverseSpin = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["360deg", "0deg"],
	});

	const images: number[] = [0, 1, 2];
	const angleStep = (2 * Math.PI) / images.length; // The angle between each image in radians
	const imageSize = Dim.width / 4;
	const radius = imageSize; // radius of the circle
	const styles = StyleSheet.create({
		container: {
			width: radius * 2 + imageSize,
			height: radius * 2 + imageSize,
			justifyContent: "center",
			alignItems: "center",
		},
		image: {
			position: "absolute",
			width: imageSize,
			height: imageSize,
		},
	});
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
			}}>
			<LinearGradient
				style={{
					width: Dim.width * 1.25,
					height: Dim.height * 1.5,
					alignItems: "center",
					justifyContent: "center",
				}}
				colors={[
					Colors.tertiary,
					Colors.primary,
					Colors.primary,
					Colors.primaryLight,
				]}
				locations={[0, 0.4, 0.75, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}>
				<View
					style={{
						position: "absolute",
					}}>
					<Animated.View
						style={{
							transform: [
								{
									rotate: spin,
								},
							],
						}}>
						<View style={styles.container}>
							{images.map((i) => {
								const angle = angleStep * i;
								return (
									<Animated.Image
										key={i}
										source={require("../../assets/logo_white.png")}
										style={[
											styles.image,
											{
												transform: [
													{ rotate: `${angle}rad` }, // Rotate the image
													{ translateX: radius * Math.sin(angle) }, // Move the image horizontally
													{ translateY: -radius * Math.cos(angle) }, // Move the image vertically
													{ rotate: "0deg" }, // Rotate the image back so it points towards the center
													{ rotate: reverseSpin },
												],
											},
										]}
									/>
								);
							})}
						</View>
					</Animated.View>
				</View>
			</LinearGradient>
		</View>
	);
}
