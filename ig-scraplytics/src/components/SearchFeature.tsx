import { FunctionComponent, useEffect, useState } from "react";
import "../styles/searchInput.css";

interface Props {
	searchableList: string[] | undefined;
	searchResults(results: string[] | undefined): void;
}

const SearchFeature: FunctionComponent<Props> = ({ searchResults, searchableList }) => {
	const [inputText, setInputText] = useState<string>("");

	useEffect(() => {
		if (searchableList && searchableList.length > 0 && inputText?.trim() !== "") {
			const res = searchableList.filter((item) => {
				return item.includes(inputText);
			});
			searchResults(res);
		} else {
			searchResults(undefined);
		}
	}, [searchableList, inputText]);

	return (
		<input
			className="search-input"
			type="text"
			value={inputText}
			placeholder="Search"
			onChange={(e) => setInputText(e.target.value.trim())}
		></input>
	);
};

export default SearchFeature;
