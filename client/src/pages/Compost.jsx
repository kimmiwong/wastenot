import CompostMap from "../components/CompostMap"
import CompostInstructions from "../components/CompostInstructions"

export default function Compost() {
    console.log('something happened')

    return (
        <>

        <div className="compost-container">
        <div><CompostInstructions /> </div>
        <div><CompostMap /></div>


        </div>
        </>

    )
}
