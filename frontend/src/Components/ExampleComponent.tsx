import { useState } from "react";
import { makeRequest } from "@/useful/ApiContext";
import { useNavigate } from "react-router-dom";

function ExampleComponent() {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    async function fetchData() {
        try {
            const response = await makeRequest({ url: "/ast?username=test&project_name=test_project" });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return (
        <div>
            <button onClick={fetchData}>Fetch Data</button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            <button onClick={() => navigate('/user/project/1')}>Go to Project</button>
        </div>
    );
}

export default ExampleComponent;