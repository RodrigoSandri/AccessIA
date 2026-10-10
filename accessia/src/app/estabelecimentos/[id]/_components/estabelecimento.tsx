import { resolve } from "path"
import { EstabelecimentoProps } from "../../page"

export async function EstabelecimentoInfo(){

    await new Promise(resolve => setTimeout(resolve, 4000))

    const response = await fetch(`https://dumyjson.com/estabelecimentos/${id}`)
    const data: EstabelecimentoProps = await response.json()

    return(
        <div>
            <h2>{data.title}</h2>
            <p>{data.body}</p>
        </div>
    )
}