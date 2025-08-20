export class ModernIDBError extends Error {
  constructor(
    name: "OpenRequestBlockedError" | "InvalidConnectionStateError",
    message: string,
  ) {
    super(message);
    this.name = name;
  }
}
