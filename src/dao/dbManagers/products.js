import productsModel from "../models/products.js";

export default class Products{

    constructor(){
        console.log("Estamos trabajando en db mongo");
    }

    getAll=async(limit, page, sort, query )=>{
        limit = parseInt(limit); 
        const skip = (Number(page) - 1) * limit;
        let products = await productsModel.aggregate([        
            {
                $sort: { price : sort == 'desc' ? -1 : 1 }
            },
            {
                $match: query ?? {},
            },
            {
                $facet: {
                    metadata: [{ $count: 'totalCount' }],
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                    total: [
                        {
                          $count: 'count',
                        },
                    ],
                },
                
            },
            {
                $unwind: '$total',
            },                      
            {
                $project: {
                    items: {
                        $slice: [
                            '$data',
                            //skip,
                            {
                                $ifNull: [limit, '$total.count'],
                            },
                        ],
                    },
                    page: {
                        $literal: skip / limit + 1,
                    },
                    prevPage:{
                        $literal:  (skip / limit + 1) -1
                    },
                    nextPage:{
                        $literal:  (skip / limit + 1)+ 1
                    },
                    hasNextPage: {
                        $lt: [{ $multiply: [limit, Number(page)] }, '$total.count'],
                    },
                    hasPrevPage: {
                        $gte: [{ $multiply: [limit, Number(page)] }, '$total.count'],
                    },
                    totalPages: {
                        $ceil: {
                            $divide: ['$total.count', limit],
                        },
                    },
                    totalItems: '$total.count',
                },
            }
        ]);

        return products;
    }

    saveProducts = async product=> {
        let result = await productsModel.create(product)
        return result
    }

    getIdProduct = async() =>{
        let endProd = await productsModel.findOne().sort([['id', 'desc']]);
        if (endProd)
            return endProd.id+1;
        return 1;
    }

    getProductById = async(id) =>{
        let product = await productsModel.findOne({'id': id});
        return product;
    }

    updateProductById = async(id, product)=> {
        let result = await productsModel.findOneAndUpdate({id:id},product)
        return result
    }

    deleteProductById = (id)=> {
        let result = productsModel.findOneAndDelete({id:id})
        return result
    }
}