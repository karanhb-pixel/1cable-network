

import React from "react";

const loaderStyle = {
	width: "40px",
	height: "40px",
	border: "4px solid #ccc",
	borderTopColor: "#3498db",
	borderRightColor: "#e74c3c",
	borderBottomColor: "#f1c40f",
	borderLeftColor: "#2ecc71",
	borderRadius: "50%",
	animation: "spin 1s linear infinite"
};

const keyframes = `@keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}`;

const LoadingIcon = () => (
	<>
		<style>{keyframes}</style>
		<div style={loaderStyle}></div>
	</>
);

export default LoadingIcon;
