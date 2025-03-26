function convertDataTypes(value, targetType) {
    if (targetType.includes("int")) return parseInt(value) || null;
    if (targetType.includes("float") || targetType.includes("double")) return parseFloat(value) || null;
    if (targetType.includes("boolean")) return value.toLowerCase() === "true";
    return value; // Default: string
}

module.exports = { convertDataTypes };
