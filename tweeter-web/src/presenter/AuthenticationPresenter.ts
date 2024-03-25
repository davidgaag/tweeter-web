import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView extends View {
   updateUserInfo: (user: User, authToken: AuthToken) => void;
   navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<T extends AuthenticationView> extends Presenter<T> {
   private _service: UserService;

   public constructor(view: T) {
      super(view);
      this._service = new UserService();
   }

   public get service(): UserService {
      return this._service;
   }

   public async doAuthentication(
      alias: string,
      password: string,
      originalUrl?: string,
      firstName?: string,
      lastName?: string,
      imageBytes?: Uint8Array) {
      this.doFailureReportingOperation(async () => {
         let [user, authToken] = await this.authenticate(alias, password, firstName, lastName, imageBytes);

         this.view.updateUserInfo(user, authToken);

         this.navigate(originalUrl);
      }, "log user in");
   };

   protected abstract authenticate(
      alias: string,
      password: string,
      firstName?: string,
      lastName?: string,
      imageBytes?: Uint8Array): Promise<[User, AuthToken]>;
   public abstract navigate(url?: string): void;
   public abstract getAuthenticationDescription(): string;
}