import React, { createRef, useEffect, useRef, useState } from "react";
import {
	View,
	Animated,
	Text,
	ActivityIndicator,
	Image,
	Easing,
} from "react-native";
import { DeviceMotion } from "expo-sensors";
import dayjs from "dayjs";
import { imageHeight, imageWidth } from "../../pages/post";
import { Gravity } from "expo-sensors/build/DeviceMotion";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import { Colors } from "../../styles/theme";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface PolaroidProps {
	imageUri: string;
	takenAt: string;
	postId: string;
	delay: number;
}
const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
// left TODO: for the fade

export default function Polaroid({
	imageUri,
	takenAt,
	delay,
	postId,
}: PolaroidProps) {
	const zoomableViewRef = createRef<ReactNativeZoomableView>();
	const [loading, setLoading] = useState(false);
	const opacity = new Animated.Value(1);
	const [finishedFading, setFinishedFading] = useState(false);
	const [shakeCount, setShakeCount] = useState(0);

	function getElapsedTime() {
		const elapsedMs = dayjs().diff(dayjs(takenAt), "millisecond");
		return elapsedMs;
	}
	const calculateTime = () => {
		const elapsedMs = getElapsedTime();
		const remainingTime = TEN_MINUTES_IN_MS - elapsedMs - 1000;
		console.log("remainingTime in minutes", remainingTime / 1000 / 60);
		return remainingTime;
	};
	function factorial(n) {
		if (n === 0) {
			return 1;
		}
		return n * factorial(n - 1);
	}
	async function calculateOpacity() {
		// only called once, so this is where we calculate if there are any legacy shakes to worry about.
		const elapsedMs = getElapsedTime();
		const remainingMs = TEN_MINUTES_IN_MS - elapsedMs - shakeCount * 60000;
		if (remainingMs < 0) {
			//the photo is done fading, remove legacy shakes form async storage and return 0
			await AsyncStorage.removeItem(`shakes_${postId}`);
			return 0;
		} else {
			// the photo is still fading calculate the starting opacity given the number of legacy shakes
			let shakes = await AsyncStorage.getItem(`shakes_${postId}`);

			let opacity =
				remainingMs / TEN_MINUTES_IN_MS - 0.05 * factorial(parseInt(shakes));
			return opacity;
		}
	}
	// async function handelShake() {
	// 	setShakeCount((prevShakeCount) => {
	// 		const newShakeCount = prevShakeCount + 1;

	// 		// Directly decrease opacity by 0.05, with a lower limit of 0
	// 		console.log("here", newShakeCount);
	// 		opacity.setOffset(-0.03 * newShakeCount);
	// 		opacity.flattenOffset();
	// 		return newShakeCount;
	// 	});
	// 	await AsyncStorage.setItem(`shakes_${postId}`, shakeCount.toString());
	// }
	// useEffect(() => {
	// 	DeviceMotion.setUpdateInterval(100);

	// 	const subscription = DeviceMotion.addListener(({ acceleration }) => {
	// 		const totalAcceleration =
	// 			Math.abs(acceleration.x) +
	// 			Math.abs(acceleration.y) +
	// 			Math.abs(acceleration.z);

	// 		if (totalAcceleration > Gravity) {
	// 			handelShake();
	// 		}
	// 	});

	// 	return () => subscription.remove();
	// }, []);
	async function handleOpacity() {
		const elapsedMs = getElapsedTime();
		if (loading) return;

		if (elapsedMs >= TEN_MINUTES_IN_MS) {
			opacity.setValue(0);
			Animated.timing(opacity, {
				toValue: 0,
				duration: 0,
				useNativeDriver: false,
				delay: delay,
			}).start();
		} else {
			let startOpacity = await calculateOpacity();
			let animationTime = calculateTime();
			opacity.setValue(startOpacity);
			Animated.timing(opacity, {
				toValue: 0,
				duration: animationTime,
				useNativeDriver: false,
			}).start();
			setFinishedFading(true);
		}
	}
	useEffect(() => {
		handleOpacity();
	}, [loading]);

	return (
		<View>
			<View
				style={{
					position: "relative",
					height: imageHeight,
					width: imageWidth,
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
					backgroundColor: "#000000",
					borderRadius: 5,
				}}>
				{/* loading */}
				{loading ? (
					<ActivityIndicator
						size="large"
						color={Colors.primary}
						style={{
							position: "absolute",
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
						}}
					/>
				) : (
					<></>
				)}

				{/* polaroid  effect */}

				<Animated.View
					style={{
						backgroundColor: "#000000",
						position: "absolute",
						top: 0,
						left: 0,
						height: imageHeight,
						width: imageWidth,
						opacity: opacity,
						zIndex: 2,
					}}
				/>
				{/* photo */}
				<ReactNativeZoomableView
					style={{ zIndex: 1, borderRadius: 5, overflow: "hidden" }}
					ref={zoomableViewRef}
					maxZoom={2}
					minZoom={1}
					zoomStep={0.5}
					initialZoom={1}
					bindToBorders={true}
					onZoomEnd={() => zoomableViewRef.current!.zoomTo(1)}>
					<Image
						source={{ uri: imageUri || "abc" }}
						style={{ height: imageHeight, width: imageWidth, borderRadius: 5 }}
						onLoadStart={() => setLoading(true)}
						onLoad={() => setLoading(false)}
					/>
				</ReactNativeZoomableView>
			</View>
		</View>
	);
}
