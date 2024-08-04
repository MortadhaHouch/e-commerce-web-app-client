import sign from "jwt-encode"
export default async function fetchData(url,method,body,setIsLoading){
    let requestBody = null;
    switch (method) {
        case "GET":
        case "DELETE":
            requestBody=null
            break;
        case "POST":
        case "PUT":
            requestBody=sign(JSON.stringify(body),import.meta.env.VITE_SECRET_KEY)
        break;
        default:
            break;
    }
    try {
        let request = await fetch(import.meta.env.VITE_REQUEST_URL+url,{
            method,
            credentials:"include",
            headers: {
                'Content-Type': 'application/json',
                "Set-Cookie":`jwt_token=${document.cookie?.jwt_token}`,
            },
            body: requestBody
        })
        setIsLoading(true);
        return await request.json();
    } catch (error) {
        setIsLoading(false);
        console.log(error);
    }finally{
        setIsLoading(false);
    }
}