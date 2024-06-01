"user server"

import { BASE_PRICE, PRODUCT_PRICE } from "@/config/product"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const createCheckoutSession = async ({
    configId
}:{
    configId : string
}) => {
    const configuration = await db.configuration.findUnique({
        where:{id: configId},
    })

    if(!configuration){
        throw new Error("nNo such configuration found")
    }

    const {getUser} = getKindeServerSession()
    const user = await getUser()

    if(!user){
        throw new Error ("You need to be logged in")
    }

    const {finish,material} = configuration

    let totalPrice = BASE_PRICE
    if(material === "polycarbonate") totalPrice += PRODUCT_PRICE.material.polycarbonate;
    if(finish === "textured") totalPrice += PRODUCT_PRICE.finish.textured;

    
}