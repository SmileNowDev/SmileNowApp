import React from "react";
import { Image, View } from "react-native";
// @ts-expect-error
import logo from "../../../assets/logo_color.png";
import { Dim } from "../../../styles/styles";
export default function LogoBackground({ scale }) {
	const numRows = 10;
	const numCols = 10;
	const logoSize = 30 * scale;
	const padding = 10 * scale; // adjust this for the desired spacing
	return (
		<View
			style={{
				position: "absolute",
				height: Dim.height * scale,
				width: Dim.width * scale,
				bottom: 0,
				top: 0,
				opacity: 0.1,

				zIndex: -1,
			}}>
			<View
				style={{
					position: "relative",
					width: Dim.width * scale,
					height: Dim.height * scale,
				}}>
				{Array.from({ length: numRows * numCols }).map((_, i) => {
					const row = Math.floor(i / numCols);
					const col = i % numCols;
					const x =
						col * (logoSize + padding) + 3 * (Math.random() - 0.5) * padding;
					const y =
						row * (logoSize + padding) + 3 * (Math.random() - 0.5) * padding;
					const rotation = Math.random() * 360;
					return (
						<Image
							key={i}
							source={logo}
							style={{
								width: logoSize,
								height: logoSize,
								opacity: 1,
								position: "absolute",
								top: y,
								left: x,
								transform: [{ rotate: `${rotation}deg` }],
							}}
						/>
					);
				})}
			</View>
		</View>
	);
}
