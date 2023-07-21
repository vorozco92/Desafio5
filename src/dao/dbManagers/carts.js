import cartsModel from "../models/carts.js";

export default class Carts{

    constructor(){
        console.log("Estamos trabajando en db mongo");
    }

    getAll=async()=>{
        let carts = await cartsModel.find().lean();
        return carts
    }

    addCart = async cart=> {
        cart.id = await this.getIdCart();
        let result = await cartsModel.create(cart)
        return result
    }

    getIdCart = async() =>{
        let endCart = await cartsModel.findOne().sort([['id', 'desc']]);
        if (endCart)
            return endCart.id+1;
        return 1;
    }

    getCartById = async(id) =>{
        let cart = await cartsModel.findOne({'id': id});
        return cart;
    }

    updateCartById = async(id, cart)=> {
        let result = await cartsModel.updateOne({id:id},cart)
        return result
    }

    deleteProductInCartById = async(cartId,productId) =>{
        let cart = await cartsModel.findOne({'id': cartId})
        if (cart){
            let products = cart.products;
            let pIndex  = products.findIndex(prod => parseInt(prod.id) === parseInt(productId));
            if (pIndex !== -1){
                products.splice(pIndex, 1)
                let cartUpdate = {
                    id: cartId,
                    products: products
                }
                cart = await cartsModel.updateOne({id: cartId}, cartUpdate);
            }      
        }
        return cart;
    }

    updateProductInCartById = async(cartId,productId, qty) =>{
        let cart = await cartsModel.findOne({'id': cartId})
        if (cart){
            let products = cart.products;
            let pIndex  = products.findIndex(prod => parseInt(prod.id) === parseInt(productId));
            if (pIndex !== -1){
                products[pIndex].qty = qty; 
                let cartUpdate = {
                    id: cartId,
                    products: products
                }
                cart = await cartsModel.updateOne({id: cartId}, cartUpdate);
            }      
        }
        return cart;
    }

    deleteProductsInCart = async(cartId) =>{
        let cart = await cartsModel.findOne({'id': cartId})
        if (cart){
            let products = [];
            if (pIndex !== -1){
                let cartUpdate = {
                    id: cartId,
                    products: products
                }
                cart = await cartsModel.updateOne({id: cartId}, cartUpdate);
            }      
        }
        return cart;
    }
}