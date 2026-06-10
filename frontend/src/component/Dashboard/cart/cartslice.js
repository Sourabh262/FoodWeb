import { createSlice } from "@reduxjs/toolkit";

const initialState={
    cartItems:[],
    cartTotalQUantity:0,
    totalAmount:0
}
const cartslice=createSlice({
    name:'cart',
    initialState,
    reducers:{
        addTocart(state,action){
            const itemIndex=state.cartItems.findIndex((ele)=>ele._id===action.payload._id);
            if(itemIndex>=0){
                state.cartItems[itemIndex].cartQuantity+=1;
            }else{
                const temproduct={...action.payload,cartQuantity:1};
                state.cartItems.push(temproduct);
            }
            // Auto calculate totals
            let {total,quantity}= state.cartItems.reduce((cartTotal,ele)=>{
                cartTotal.total += ele.price * ele.cartQuantity;
                cartTotal.quantity += ele.cartQuantity;
                return cartTotal
            },{total:0, quantity:0});
            state.totalAmount=total;
            state.cartTotalQUantity=quantity;
        },
        removeCartItem(state,action){
           const newCart= state.cartItems.filter(
                ele=> ele._id!==action.payload._id
            );
            state.cartItems=newCart;
            // Auto calculate totals
            let {total,quantity}= state.cartItems.reduce((cartTotal,ele)=>{
                cartTotal.total += ele.price * ele.cartQuantity;
                cartTotal.quantity += ele.cartQuantity;
                return cartTotal
            },{total:0, quantity:0});
            state.totalAmount=total;
            state.cartTotalQUantity=quantity;
        },
        decreaseCart(state,action){
            const itemIndex=state.cartItems.findIndex((ele)=>ele._id===action.payload._id)
            if(state.cartItems[itemIndex].cartQuantity>1){
                state.cartItems[itemIndex].cartQuantity-=1;
            }
            // Auto calculate totals
            let {total,quantity}= state.cartItems.reduce((cartTotal,ele)=>{
                cartTotal.total += ele.price * ele.cartQuantity;
                cartTotal.quantity += ele.cartQuantity;
                return cartTotal
            },{total:0, quantity:0});
            state.totalAmount=total;
            state.cartTotalQUantity=quantity;
        },
        clearCartItem(state,action){
            state.cartItems=[];
            state.totalAmount=0;
            state.cartTotalQUantity=0;
        },
        getTotals(state,action){
            // Keep for backward compatibility if needed, but logic is now internal
            let {total,quantity}= state.cartItems.reduce((cartTotal,ele)=>{
                cartTotal.total += ele.price * ele.cartQuantity;
                cartTotal.quantity += ele.cartQuantity;
                return cartTotal
            },{total:0, quantity:0});
            state.totalAmount=total;
            state.cartTotalQUantity=quantity;
        },
    }
})

export const {addTocart,removeCartItem,decreaseCart,clearCartItem,getTotals} =cartslice.actions;
export default cartslice.reducer