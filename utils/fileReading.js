export default function fileReading(file){
    return new Promise((resolve,reject)=>{
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener("load",function(){
            if(fileReader.result){
                resolve(fileReader.result);
            }else{
                reject("error reading file");
            }
        })
    })
}