import { Failure, Success } from "@indietabletop/appkit/async-op";
import { Infer, mask, object, string, Struct } from "superstruct";
import { currentUser, sessionInfo } from "./structs.js";
import { CurrentUser, FailurePayload, SessionInfo } from "./types.js";

export class IndieTabletopClient {
  origin: string;
  private onCurrentUser?: (currentUser: CurrentUser) => void;
  private onSessionInfo?: (sessionInfo: SessionInfo) => void;
  private onSessionExpired?: () => void;
  private refreshTokenPromise?: Promise<
    Success<{ sessionInfo: SessionInfo }> | Failure<FailurePayload>
  >;

  constructor(props: {
    apiOrigin: string;

    /**
     * Runs every time the current user is fetched from the API. Typically, this
     * happens during login, signup, and when the current user is fetched.
     */
    onCurrentUser?: (currentUser: CurrentUser) => void;

    /**
     * Runs ever time new session info is fetched from the API. Typically, this
     * happends during login, signup, and when tokens are refreshed.
     */
    onSessionInfo?: (sessionInfo: SessionInfo) => void;

    /**
     * Runs when token refresh is attempted, but fails due to 401 error.
     */
    onSessionExpired?: () => void;
  }) {
    this.origin = props.apiOrigin;
    this.onCurrentUser = props.onCurrentUser;
    this.onSessionInfo = props.onSessionInfo;
    this.onSessionExpired = props.onSessionExpired;
  }

  protected async fetch<T, S>(
    path: string,
    struct: Struct<T, S>,
    init?: RequestInit & { json?: object },
  ): Promise<Success<Infer<Struct<T, S>>> | Failure<FailurePayload>> {
    // If json was provided, we stringify it. Otherwise we use body.
    const body = init?.json ? JSON.stringify(init.json) : init?.body;

    // If json was provided, we make sure that content type is correctly set.
    const headers = init?.json
      ? { ...init?.headers, "Content-Type": "application/json" }
      : init?.headers;

    try {
      const res = await fetch(`${this.origin}${path}`, {
        // Defaults
        credentials: "include",

        // Overrides
        ...init,
        body,
        headers,
      });

      if (!res.ok) {
        console.error(res);
        return new Failure({ type: "API_ERROR", code: res.status });
      }

      try {
        const data = mask(await res.json(), struct);
        return new Success(data);
      } catch (error) {
        console.error(error);

        return new Failure({ type: "VALIDATION_ERROR" });
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        return new Failure({ type: "NETWORK_ERROR" });
      }

      return new Failure({ type: "UNKNOWN_ERROR" });
    }
  }

  /**
   * Fetches data and retries 401 failures after attempting to refresh tokens.
   */
  protected async fetchWithAuth<T, S>(
    path: string,
    struct: Struct<T, S>,
    init?: RequestInit & { json?: object },
  ): Promise<Success<Infer<Struct<T, S>>> | Failure<FailurePayload>> {
    const op = await this.fetch(path, struct, init);

    if (op.isSuccess) {
      return op;
    }

    if (op.failure.type === "API_ERROR" && op.failure.code === 401) {
      console.info("API request failed with error 401. Refreshing tokens.");

      const refreshOp = await this.refreshTokens();

      if (refreshOp.isSuccess) {
        console.info("Tokens refreshed. Retrying request.");
        return await this.fetch(path, struct, init);
      } else {
        console.info("Could not refresh tokens.");
      }
    }

    return op;
  }

  async login(payload: { email: string; password: string }) {
    const result = await this.fetch(
      "/v1/sessions",
      object({
        currentUser: currentUser(),
        sessionInfo: sessionInfo(),
      }),
      {
        method: "POST",
        json: { email: payload.email, plaintextPassword: payload.password },
      },
    );

    if (result.isSuccess) {
      this.onCurrentUser?.(result.value.currentUser);
      this.onSessionInfo?.(result.value.sessionInfo);
    }

    return result;
  }

  async logout() {
    return await this.fetch("/v1/sessions", object({ message: string() }), {
      method: "DELETE",
    });
  }

  async join(payload: {
    email: string;
    password: string;
    acceptedTos: boolean;
  }) {
    const res = await this.fetch(
      "/v1/users",
      object({
        currentUser: currentUser(),
        sessionInfo: sessionInfo(),
        tokenId: string(),
      }),
      {
        method: "POST",
        json: {
          email: payload.email,
          plaintextPassword: payload.password,
          acceptedTos: payload.acceptedTos,
        },
      },
    );

    if (res.isSuccess) {
      this.onCurrentUser?.(res.value.currentUser);
      this.onSessionInfo?.(res.value.sessionInfo);
    }

    return res;
  }

  /**
   * Triggers token refresh process.
   *
   * Note that we do not want to perform multiple concurrent token refresh
   * actions, as that will result in unnecessary 401s. For this reason, a
   * reference to t
   */
  async refreshTokens() {
    // If there is an ongoing token refresh in progress return that. This should
    // only deal the response payload, none of the side-effects and cleanup,
    // which will be handled by the initial invocation.
    const ongoingRequest = this.refreshTokenPromise;

    if (ongoingRequest) {
      console.info("Token refresh ongoing. Reusing existing promise.");
      return await ongoingRequest;
    }

    // Cache the promise on an instance property to share a reference from
    // other potential invocations.
    this.refreshTokenPromise = this.fetch(
      "/v1/sessions/access-tokens",
      object({ sessionInfo: sessionInfo() }),
      { method: "POST" },
    );

    const result = await this.refreshTokenPromise;

    if (result.isSuccess) {
      this.onSessionInfo?.(result.value.sessionInfo);
    }

    if (
      result.isFailure &&
      result.failure.type === "API_ERROR" &&
      result.failure.code === 401
    ) {
      this.onSessionExpired?.();
    }

    // Make sure to reset the shared reference so that subsequent invocations
    // once again initiate token refresh.
    delete this.refreshTokenPromise;

    return result;
  }

  async requestPasswordReset(payload: { email: string }) {
    return await this.fetch(
      `/v1/password-reset-tokens`,
      object({ message: string(), tokenId: string() }),
      { method: "POST", json: payload },
    );
  }

  async checkPasswordResetCode(payload: { tokenId: string; code: string }) {
    const queryParams = new URLSearchParams({ plaintextCode: payload.code });
    return await this.fetch(
      `/v1/password-reset-tokens/${payload.tokenId}?${queryParams}`,
      object({ message: string() }),
      { method: "GET" },
    );
  }

  async setNewPassword(payload: {
    tokenId: string;
    code: string;
    password: string;
  }) {
    const queryParams = new URLSearchParams({ plaintextCode: payload.code });
    return await this.fetch(
      `/v1/password-reset-tokens/${payload.tokenId}?${queryParams}`,
      object({ message: string() }),
      { method: "PUT", json: { plaintextPassword: payload.password } },
    );
  }

  async requestUserVerification() {
    return await this.fetch(
      `/v1/user-verification-tokens`,
      object({ message: string(), tokenId: string() }),
      { method: "POST" },
    );
  }

  async verifyUser(payload: { tokenId: string; code: string }) {
    const queryParams = new URLSearchParams({ plaintextCode: payload.code });
    const req = await this.fetch(
      `/v1/user-verification-tokens/${payload.tokenId}?${queryParams}`,
      object({ message: string() }),
      { method: "PUT" },
    );

    if (req.isSuccess) {
      await this.refreshTokens();
      await this.getCurrentUser();
    }

    return req;
  }

  async getCurrentUser() {
    const result = await this.fetchWithAuth(`/v1/users/me`, currentUser());

    if (result.isSuccess) {
      this.onCurrentUser?.(result.value);
    }

    // If /users/me request failed with 401 error, try again with the Ory
    // endpoint for legacy users. This code block can be removed once Ory
    // users are fully migrated.
    if (
      result.isFailure &&
      result.failure.type === "API_ERROR" &&
      result.failure.code === 401
    ) {
      const oryR = await this.fetch(
        `/v1/users/ory`,
        object({
          currentUser: currentUser(),
          sessionInfo: sessionInfo(),
        }),
      );

      if (oryR.isSuccess) {
        this.onCurrentUser?.(oryR.value.currentUser);
        this.onSessionInfo?.(oryR.value.sessionInfo);
      }

      return oryR;
    }

    return result;
  }
}
