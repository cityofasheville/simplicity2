export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function normalizeFilterText(value) {
	return String(value ?? "")
		.toLowerCase()
		.replace(/[#,]/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function formatAddressUnit(unit) {
	const normalizedUnit = String(unit ?? "").trim();
	return normalizedUnit ? `#${normalizedUnit}` : "";
}
