import React from "react";

interface Props {
   setAlias: React.Dispatch<React.SetStateAction<string>>;
   setPassword: React.Dispatch<React.SetStateAction<string>>;
   pageType: PageType;
}

enum PageType {
   Login = "login",
   Register = "register",
}

const AuthenticationFields = (props: Props) => { // TODO: Use object destructuring instead of props? Same question/TODO applies for all other similar cases
   return (
      <>
         <div className="form-floating">
            <input
               type="text"
               className="form-control"
               size={50}
               id="aliasInput"
               placeholder="name@example.com"
               onChange={(event) => props.setAlias(event.target.value)}
            />
            <label htmlFor="aliasInput">Alias</label>
         </div>
         <div className={props.pageType === PageType.Register ? "form-floating" : "form-floating mb-3"}>
            <input
               type="password"
               className="form-control bottom"
               id="passwordInput"
               placeholder="Password"
               onChange={(event) => props.setPassword(event.target.value)}
            />
            <label htmlFor="passwordInput">Password</label>
         </div>
      </>
   )
};

export {
   AuthenticationFields,
   PageType
};