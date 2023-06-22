import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	products: [],
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addProduct: (state, action) => {
			const items = state.products.find(
				(item) => item.id === action.payload.id
			);
			if (items) {
				items.quantity += action.payload.quantity;
			} else {
				state.products.push(action.payload);
			}
		},
		increaseProduct: (state, action) => {
			const items = state.products.find(
				(item) => item.id === action.payload.id
			);
			if (items) {
				items.quantity += 1;
			} else {
				state.products.push(action.payload);
			}
		},
		decreaseProduct: (state, action) => {
			const items = state.products.find(
				(item) => item.id === action.payload.id
			);
			if (items) {
				items.quantity -= 1;
			} else {
				state.products.push(action.payload);
			}
		},
		removeProduct: (state, action) => {
			state.products = state.products.filter(
				(item) => item.id !== action.payload.id
			);
		},
		// state.products.push(action.payload);
		// state.quantity += 1;
		// state.total += action.payload.price * action.payload.quantity;
		reset: (state) => {
			state.products = [];
		},
	},
});

export const {
	addProduct,
	increaseProduct,
	decreaseProduct,
	removeProduct,
	reset,
} = cartSlice.actions;

export default cartSlice.reducer;
