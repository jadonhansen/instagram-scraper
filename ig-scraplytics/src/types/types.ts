export interface SuccessResponse<SuccessResponseData> {
	data: SuccessResponseData;
	error: undefined;
	headers?: Headers;
}

export type ErrorResponse<ErrorResponseData = undefined> = [ErrorResponseData] extends [undefined]
	? {
			data: undefined;
			error: Error;
			headers?: Headers;
		}
	: {
			data: undefined;
			error: ErrorResponseData | Error;
			headers?: Headers;
		};

export type ApiResponse<SuccessResponseData, ErrorResponseData = undefined> =
	| SuccessResponse<SuccessResponseData>
	| ErrorResponse<ErrorResponseData>;

export interface UserPostRelationship {
	user: string;
	numberOfPostsLiked: number;
}
