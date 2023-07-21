import { Router } from "express"
import Products  from "../dao/dbManagers/products.js";

const router = Router();
const productManager = new Products();

router.get('/',async(req,res)=>{
    let limit = req.query.limit ?? 10;
    let page = req.query.page ?? 1;
    let sort = req.query.sort ?? 'asc';
    let body = req.body ?? {};
    console.log(body);
    sort =  sort.toLowerCase();
    let products = await productManager.getAll(limit, page, sort, body);


    if (! products[0].totalItems)
        res.send({status:'error', error:'No se obtuvieron resultados de productos'})
    else
        res.send({status:'success',
            payload:products[0].items,
            totalPages:products[0].totalPages,
            prevPage: products[0].prevPage,
            nextPage: products[0].nextPage,
            page: products[0].page,
            hasNextPage: products[0].hasNextPage,
            hasPrevPage: products[0].hasPrevPage,
            prevLink: products[0].hasPrevPage ? (req.protocol+'://'+req.get('host')+ req.originalUrl).replace('page='+products[0].page, 'page='+products[0].prevPage): null,
            nextLink: products[0].hasNextPage ? (req.protocol+'://'+req.get('host')+ req.originalUrl).replace('page='+products[0].page, 'page='+products[0].nextPage) : null
        })
})

router.post('/',async(req,res)=>{
    const {title, description, code, price, stock, category} = req.body;
    let newProduct = {
        title: title,
        description: description,
        code : code,
        price : price,
        stock : stock,
        category : category
    }

    newProduct.id =  await productManager.getIdProduct();
    if (req.body.thumbnails)
        newProduct.thumbnails = req.body.thumbnails

    if (req.body.status)
        newProduct.status = req.body.status

    let result =await productManager.saveProducts(newProduct)
    req.app.io.sockets.emit('update_data', {id:result.id,product:result})
    res.send({status:'success',product:result})
})

router.get('/:id', async(req, res)=>{
    let productId = req.params.id;
    let product = await productManager.getProductById(productId);
    if (product.id)
        res.send({status:'success',product:product})
    else
        res.send({status:'error','error_description':`producto con Id ${productId} no fue encontrado.`})
})

router.put('/:id', async(req, res)=>{
    let productId = req.params.id;
    let product = await productManager.getProductById(productId);
    if (product){
        let productBody = req.body;
        let productEdit = await productManager.updateProductById(productId, productBody);
        res.send({status:'success',product:productEdit})
    }
    else
        res.send({status:'error','error_description':`producto con Id ${productId} no fue encontrado.`})
})

router.delete('/:pid', (req, res)=>{
    let pid = req.params.pid;
    if(productManager.deleteProductById(pid)){
        req.app.io.sockets.emit('delete_product', pid)
        res.send({status:"success", message :"Producto eliminado correctamente"});
    }
    else
        res.send({status:"error", message :"No fue posible eliminar el producto"});
});
export default router;