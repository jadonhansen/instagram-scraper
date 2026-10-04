import { FunctionComponent, ReactNode } from "react";

import { Loadable } from "../../hooks/useAccountStats";

interface Props {
	title: string;
	meta?: ReactNode;
	className?: string;
	children: ReactNode;
}

const Card: FunctionComponent<Props> = ({ title, meta, className, children }) => {
	return (
		<section className={"card" + (className ? " " + className : "")} aria-label={title}>
			<header className="card-header">
				<h2 className="card-title">{title}</h2>
				{meta && <div className="card-meta">{meta}</div>}
			</header>
			{children}
		</section>
	);
};

export default Card;

// Renders the loading or error state of a stat, or nothing once it is ready.
export function LoadState({ value }: { value: Loadable<unknown> }) {
	if (value === undefined) return <p className="card-status">Loading...</p>;
	if (value instanceof Error)
		return (
			<p className="card-status card-status-error" role="alert">
				{value.message}. Scrape this account to fix it.
			</p>
		);
	return null;
}
