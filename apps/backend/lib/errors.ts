export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
  ) {
    super(message);
  }
}
