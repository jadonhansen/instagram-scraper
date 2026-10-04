export type ScrapeErrorCode =
	| "INVALID_USERNAME"
	| "LOGIN_REQUIRED"
	| "INVALID_SESSION"
	| "LOGIN_TIMEOUT"
	| "RATE_LIMITED"
	| "USER_NOT_FOUND"
	| "LIST_NOT_VISIBLE"
	| "UNEXPECTED_RESPONSE"
	| "BROWSER_CLOSED"
	| "CANCELLED";

export class ScrapeError extends Error {
	readonly code: ScrapeErrorCode;

	constructor(code: ScrapeErrorCode, message: string) {
		super(message);
		this.name = "ScrapeError";
		this.code = code;
	}
}

// Instagram usernames are 1-30 chars of letters, digits, "." and "_". This also keeps the db folder path safe.
const usernamePattern = /^[A-Za-z0-9._]{1,30}$/;

// The instagram.com "sessionid" cookie is "<user id>%3A<token>..." and never contains spaces or ";".
const sessionIdPattern = /^\d+%3A[^\s;]+$/;

export function assertValidSessionId(sessionId: string): void {
	if (!sessionIdPattern.test(sessionId)) {
		throw new ScrapeError(
			"INVALID_SESSION",
			"That does not look like an Instagram sessionid cookie. Copy the whole value of the sessionid cookie.",
		);
	}
}

export function assertValidUsername(username: string): void {
	if (!usernamePattern.test(username) || username === "." || username === "..") {
		throw new ScrapeError("INVALID_USERNAME", `"${username}" is not a valid Instagram username.`);
	}
}
