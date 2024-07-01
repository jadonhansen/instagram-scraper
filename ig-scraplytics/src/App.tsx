import { useEffect, useState } from "react";
import { testServer } from "./api/instagramServer";

function App() {
	const [serverTest, setServerTest] = useState<string | Error>("");

	useEffect(() => {
		callServer();
	});

	const callServer = async () => {
		const res = await testServer();
		setServerTest(res);
	};

	return (
		<>
			<p>IG Scraplytics</p>
			{serverTest === "" ? <p>Loading...</p> : <p>{serverTest.toString()}</p>}
		</>
	);
}

export default App;
