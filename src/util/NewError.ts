export class NewError extends Error {
  constructor(
    public message: string = "Something went wrong",
    public statusCode: number = 500,
    public data?: any[] | object | string
  ) {
    super();
  }
}