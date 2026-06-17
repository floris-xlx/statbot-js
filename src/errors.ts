export class StatbotApiError<TBody = unknown> extends Error {
  readonly status: number;
  readonly body: TBody;
  readonly response: Response;

  constructor(status: number, body: TBody, response: Response) {
    super(`Statbot API request failed with status ${status}`);
    this.name = "StatbotApiError";
    this.status = status;
    this.body = body;
    this.response = response;
  }
}
