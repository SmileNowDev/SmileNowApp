import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";

export const downloadImage = async (ref: any) => {
	try {
		console.log("downloading");
		console.log(ref);
		// react-native-view-shot caputures component
		const uri = await captureRef(ref, {
			format: "png",
			quality: 1,
		});

		// cameraroll saves image
		const image = MediaLibrary.saveToLibraryAsync(uri);
		if (image) {
			Alert.alert(
				"Image saved",
				"Successfully saved image to your gallery.",
				[{ text: "OK", onPress: () => {} }],
				{ cancelable: false }
			);
		}
	} catch (error) {
		console.log("error", error);
	}
};
// export const exportPDF = async (ref: React.MutableRefObject<undefined>) => {
// 	try {
// 		const uri = await captureRef(ref, {
// 			format: "png",
// 			quality: 1,
// 		});

// 		const html = `<img src="${uri}" />`; // Convert captured image to HTML

// 		const options = {
// 			html, // your HTML code goes here
// 			fileName: "output",
// 			base64: true,
// 		};

// 		const pdf = await RNHTMLtoPDF.convert(options); // Convert HTML to PDF
// 		console.log(pdf.filePath);
// 		// You can use the pdf.filePath or pdf.base64 for further actions, such as sharing the PDF

// 		Alert.alert("PDF Exported", "Successfully exported PDF.", [{ text: "OK" }]);
// 	} catch (error) {
// 		console.log("error", error);
// 	}
// };
