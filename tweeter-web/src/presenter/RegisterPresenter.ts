import { Buffer } from "buffer";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
   setImageUrl: (url: string) => void;
   setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
   protected authenticate(
      alias: string,
      password: string,
      firstName?: string,
      lastName?: string,
      imageBytes?: Uint8Array) {
      return this.service.register(firstName!, lastName!, alias, password, imageBytes!);
   }

   public navigate() {
      this.view.navigate("/");
   }

   public getAuthenticationDescription() {
      return "register user";
   }

   public handleImageFile(file: File | undefined) {
      if (file) {
         this.view.setImageUrl(URL.createObjectURL(file));

         const reader = new FileReader();
         reader.onload = (event: ProgressEvent<FileReader>) => {
            const imageStringBase64 = event.target?.result as string;

            // Remove unnecessary file metadata from the start of the string.
            const imageStringBase64BufferContents =
               imageStringBase64.split("base64,")[1];

            const bytes: Uint8Array = Buffer.from(
               imageStringBase64BufferContents,
               "base64"
            );

            this.view.setImageBytes(bytes);
         };
         reader.readAsDataURL(file);
      } else {
         this.view.setImageUrl("");
         this.view.setImageBytes(new Uint8Array());
      }
   };
}