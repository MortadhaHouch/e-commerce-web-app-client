export default function Loading(){
    let spansArray = [];
    for (let index = 0; index < 40; index++) {
        spansArray.push(index);
    }
    return (
        <div className="loading">
            <div>
                {
                    spansArray.map((item,index)=>{
                        return(
                            <span key={index} style={{
                                transform:`rotate(${9*index}deg) translateX(150px)`,
                                animationDelay:`${index*.5}s`,
                                backgroundColor:`rgba(0, 141, 218,${1/index})`
                            }}></span>
                        )
                    })
                }
            </div>
        </div>
    )
}