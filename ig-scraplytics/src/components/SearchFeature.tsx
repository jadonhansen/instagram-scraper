import { FunctionComponent, useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import "../styles/searchInput.css";

interface Props {
	label?: string;
	searchableList: string[] | undefined;
	searchResults(results: string[] | undefined): void;
}

const SearchFeature: FunctionComponent<Props> = ({ label = "Search", searchResults, searchableList }) => {
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
		<label className="search-field">
			<FaMagnifyingGlass aria-hidden="true" />
			<input
				className="search-input"
				type="search"
				value={inputText}
				placeholder="Search"
				aria-label={label}
				onChange={(e) => setInputText(e.target.value.trim())}
			></input>
		</label>
	);
};

export default SearchFeature;
