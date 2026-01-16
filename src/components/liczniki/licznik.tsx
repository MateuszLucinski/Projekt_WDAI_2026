import { useState } from "react";

function Licznik(){
    const [state,setState] = useState<number>(Number(localStorage.getItem("licznik")));

    const increment = () => {
        setState(state+1);
        localStorage.setItem("licznik", (state+1).toString());
    }

    return (
        <>
        <div>{state}</div>
        <button onClick={increment}>Zwiększ licznik</button>
        </>
    );
}
export default Licznik