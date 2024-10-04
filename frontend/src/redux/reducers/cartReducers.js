import * as actionTypes from "../constants/cartConstants";

const CART_INITIAL_STATE = {
    cartItems: [],
    itemsCount: 0,
    cartSubTotal: 0,
}

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.ADD_TO_CART:
            console.log(action.payload)
            const productBeingAddedToCart = action.payload;

            const productAlreadyExistsInState = state.cartItems.find(
                (x) => x.productId === productBeingAddedToCart.productId
            );

            const currentState = { ...state };

            if (productAlreadyExistsInState) {
                // If the product already exists in the cart, update its quantity
                currentState.cartItems = state.cartItems.map((x) =>
                    x.productId === productBeingAddedToCart.productId
                        ? { ...x, quantity: Number(x.quantity) + Number(productBeingAddedToCart.quantity) }
                        : x
                );
            } else {
                // Add new product to cart
                currentState.cartItems = [...state.cartItems, productBeingAddedToCart];
            }

            // Recalculate itemsCount and cartSubTotal
            currentState.itemsCount = currentState.cartItems.reduce(
                (acc, item) => acc + Number(item.quantity),
                0
            );

            currentState.cartSubTotal = currentState.cartItems.reduce(
                (acc, item) => acc + Number(item.quantity) * Number(item.price),
                0
            );

            return currentState;
        case actionTypes.REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.productId !== action.payload.productId),
                itemsCount: state.itemsCount - action.payload.quantity,
                cartSubTotal: state.cartSubTotal - action.payload.price * action.payload.quantity
            }
        default:
            return state;
    }
};
