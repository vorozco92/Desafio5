import mongoose from "mongoose";

const cartsCollection = 'carts'
const cartSchema = mongoose.Schema({

    id: {
        type: Number,
        required : true
    },
    products: {
        type: Array,
        default: []
    }
})

const cartsModel =  mongoose.model(cartsCollection, cartSchema)
export default cartsModel;