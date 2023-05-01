export function generateColorFromLetters(letters: string): string {
	const hueRange = [0, 359];
	const saturationRange = [90, 100];
	const lightnessRange = [80, 95];

	let hue: number, saturation: number, lightness: number;
	if (letters.length === 1) {
		hue =
			(letters.charCodeAt(0) % (hueRange[1] - hueRange[0] + 1)) + hueRange[0];
		saturation =
			((letters.charCodeAt(0) * 2) %
				(saturationRange[1] - saturationRange[0] + 1)) +
			saturationRange[0];
		lightness =
			((letters.charCodeAt(0) * 3) %
				(lightnessRange[1] - lightnessRange[0] + 1)) +
			lightnessRange[0];
	} else if (letters.length === 2) {
		const charCodes = letters.split("").map((letter) => letter.charCodeAt(0));
		hue =
			((charCodes[0] * charCodes[1]) % (hueRange[1] - hueRange[0] + 1)) +
			hueRange[0];
		saturation =
			((charCodes[0] + charCodes[1]) %
				(saturationRange[1] - saturationRange[0] + 1)) +
			saturationRange[0];
		lightness =
			((charCodes[0] - charCodes[1]) %
				(lightnessRange[1] - lightnessRange[0] + 1)) +
			lightnessRange[0];
	} else {
		throw new Error("Invalid input");
	}
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
