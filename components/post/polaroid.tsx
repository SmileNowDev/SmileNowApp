import React, { createRef, useState } from "react";
import { View, Image } from "react-native";
import { imageHeight, imageWidth } from "../../pages/post";
import ReactNativeZoomableView from "@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView";
import PolaroidLoader from "../../components/core/polaroidLoader";
interface PolaroidProps {
	imageUri: string;
	takenAt: string;
	postId: string;
}

export default function Polaroid({ imageUri, takenAt, postId }: PolaroidProps) {
	const zoomableViewRef = createRef<ReactNativeZoomableView>();
	const [loading, setLoading] = useState(false);

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
					backgroundColor: "#808080",
					borderRadius: 5,
				}}>
				{/* polaroid  effect */}
				<ReactNativeZoomableView
					style={{ zIndex: 1, borderRadius: 5, overflow: "hidden" }}
					ref={zoomableViewRef}
					maxZoom={2}
					minZoom={1}
					zoomStep={0.5}
					initialZoom={1}
					bindToBorders={true}
					onZoomEnd={() => zoomableViewRef.current!.zoomTo(1)}>
					<PolaroidLoader loading={loading} />
					<Image
						source={{ uri: imageUri || "abc" }}
						style={{
							height: imageHeight,
							width: imageWidth,
							borderRadius: 5,
							zIndex: 50,
						}}
						onLoadStart={() => {
							if (!!imageUri) {
								setLoading(true);
							}
						}}
						onLoad={() => setLoading(false)}
					/>
				</ReactNativeZoomableView>
			</View>
		</View>
	);
}
// V1 OF THE POLAROID CONCEPT - PHOTOS WOULD BE COMPLETELY HIDDEN AT FIRST AND TAKE 10 MINUTES TO FADE IN
// const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
// const opacity = new Animated.Value(1);
// const [finishedFading, setFinishedFading] = useState(false);
// const [shakeCount, setShakeCount] = useState(0);
// function getElapsedTime() {
// 	const elapsedMs = dayjs().diff(dayjs(takenAt), "millisecond");
// 	return elapsedMs;
// }
// const calculateTime = () => {
// 	const elapsedMs = getElapsedTime();
// 	const remainingTime = TEN_MINUTES_IN_MS - elapsedMs - 1000;
// 	console.log("remainingTime in minutes", remainingTime / 1000 / 60);
// 	return remainingTime;
// };
// function factorial(n) {
// 	if (n === 0) {
// 		return 1;
// 	}
// 	return n * factorial(n - 1);
// }
// async function calculateOpacity() {
// 	// only called once, so this is where we calculate if there are any legacy shakes to worry about.
// 	const elapsedMs = getElapsedTime();
// 	const remainingMs = TEN_MINUTES_IN_MS - elapsedMs - shakeCount * 60000;
// 	if (remainingMs < 0) {
// 		//the photo is done fading, remove legacy shakes form async storage and return 0
// 		await AsyncStorage.removeItem(`shakes_${postId}`);
// 		return 0;
// 	} else {
// 		// the photo is still fading calculate the starting opacity given the number of legacy shakes
// 		let shakes = await AsyncStorage.getItem(`shakes_${postId}`);

// 		let opacity =
// 			remainingMs / TEN_MINUTES_IN_MS - 0.05 * factorial(parseInt(shakes));
// 		return opacity;
// 	}
// }
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
// async function handleOpacity() {
// 	// const elapsedMs = getElapsedTime();
// 	if (loading) return;

// 	if (elapsedMs >= TEN_MINUTES_IN_MS) {
// 		opacity.setValue(0);
// 		Animated.timing(opacity, {
// 			toValue: 0,
// 			duration: 0,
// 			useNativeDriver: false,
// 			delay: delay,
// 		}).start();
// 	} else {
// 		let startOpacity = await calculateOpacity();
// 		let animationTime = calculateTime();
// 		opacity.setValue(startOpacity);
// 		Animated.timing(opacity, {
// 			toValue: 0,
// 			duration: animationTime,
// 			useNativeDriver: false,
// 		}).start();
// 		setFinishedFading(true);
// 	}
// }
// useEffect(() => {
// 	handleOpacity();
// }, [loading]);
{
	/* <Animated.View
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
					/> */
}
{
	/* photo */
}
