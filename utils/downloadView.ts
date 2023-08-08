import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export const downloadImage = async (ref: any) => {
	try {
		const uri = await captureRef(ref, {
			format: "png",
			quality: 1,
		});
		console.log("uri", uri);
		let image = await MediaLibrary.saveToLibraryAsync(uri);
		console.log("image", image);
		Alert.alert(
			"Image saved",
			"Successfully saved image to your gallery.",
			[{ text: "OK", onPress: () => {} }],
			{ cancelable: false }
		);
	} catch (error) {
		console.log("error", error);
	}
};
