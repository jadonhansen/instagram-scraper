export interface Error {
	status: number;
	message: string;
}

export interface QuerySuccess<QuerySuccessData> {
	data: QuerySuccessData;
	error: undefined;
}

export type QueryError<QueryErrorData = undefined> = [QueryErrorData] extends [undefined]
	? {
			data: undefined;
			error: Error;
		}
	: {
			data: undefined;
			error: QueryErrorData | Error;
		};

export type QueryResponse<QuerySuccessData, QueryErrorData = undefined> =
	| QuerySuccess<QuerySuccessData>
	| QueryError<QueryErrorData>;
