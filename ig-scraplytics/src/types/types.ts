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

export type ScrapePhase = "starting" | "waiting_for_login" | "profile" | "followers" | "following";

export interface ScrapeJob {
	id: string;
	username: string;
	status: "running" | "done" | "error" | "cancelled";
	progress: { phase: ScrapePhase; fetched: number; total: number; message?: string };
	summary?: { username: string; followers?: number; following?: number };
	error?: { code: string; message: string };
	startedAt: string;
	finishedAt?: string;
}
