import { useParams } from "react-router-dom"
function User(){

    const {id} = useParams()
    return (
        <div>
            user: {id}
        </div>
    )
}

export default User