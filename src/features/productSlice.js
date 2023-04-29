import {createSlice, createAsyncThunk, createEntityAdapter} from "@reduxjs/toolkit"
import axios from 'axios'

export const getProducts = createAsyncThunk("products/getProducts", async()=>{
    const resp = await axios.get("http://localhost:8000/products")
    return resp.data
})

export const saveProduct = createAsyncThunk("products/saveProduct", async({title, price})=>{
    const resp = await axios.post("http://localhost:8000/products",{
        title,
        price
    })
    return resp.data
})

export const updateProduct = createAsyncThunk("products/updateProduct", async({id,title, price})=>{
    const resp = await axios.patch(`http://localhost:8000/products/${id}`,{
        title,
        price
    })
    return resp.data
})

export const deleteProduct = createAsyncThunk("products/deleteProduct", async(id)=>{
    await axios.delete(`http://localhost:8000/products/${id}`)
    return id
})

const productEntity = createEntityAdapter({
    selectId: (product)=> product.id
});

const productSlice = createSlice({
    name: "product",
    initialState: productEntity.getInitialState(),
    extraReducers:{
        [getProducts.fulfilled]:(state, action)=>{
            productEntity.setAll(state, action.payload);
        },
        [saveProduct.fulfilled]:(state, action)=>{
            productEntity.addOne(state, action.payload);
        },
        [deleteProduct.fulfilled]:(state, action)=>{
            productEntity.removeOne(state, action.payload)
        },
        [updateProduct.fulfilled]: (state, action)=>{
            productEntity.updateOne(state, {id:action.payload.id, updates:action.payload})
        }
    }
});

export const productSelectors = productEntity.getSelectors(state => state.product)
export default productSlice.reducer;