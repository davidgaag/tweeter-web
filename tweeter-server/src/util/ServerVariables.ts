export function getServerValue(valueName: string) {
   const USER_TABLE_NAME = "user";
   const USER_PRIMARY_KEY = "alias";
   const USER_FIRST_NAME = "firstName";
   const USER_LAST_NAME = "lastName";
   const USER_PASSWORD = "password";
   const USER_IMAGE_URL = "imageUrl";
   const USER_FOLLOWING_COUNT = "numFollowees";
   const USER_FOLLOWERS_COUNT = "numFollowers";

   const FOLLOW_TABLE_NAME = "follows";
   const FOLLOW_PRIMARY_KEY = "follower_handle";
   const FOLLOW_SORT_KEY = "followee_handle";

   switch (valueName) {
      case "USER_TABLE_NAME":
         return USER_TABLE_NAME;
      case "USER_PRIMARY_KEY":
         return USER_PRIMARY_KEY;
      case "USER_FIRST_NAME":
         return USER_FIRST_NAME;
      case "USER_LAST_NAME":
         return USER_LAST_NAME;
      case "USER_PASSWORD":
         return USER_PASSWORD;
      case "USER_IMAGE_URL":
         return USER_IMAGE_URL;
      case "USER_FOLLOWING_COUNT":
         return USER_FOLLOWING_COUNT;
      case "USER_FOLLOWERS_COUNT":
         return USER_FOLLOWERS_COUNT;
      case "FOLLOW_TABLE_NAME":
         return FOLLOW_TABLE_NAME;
      case "FOLLOW_PRIMARY_KEY":
         return FOLLOW_PRIMARY_KEY;
      case "FOLLOW_SORT_KEY":
         return FOLLOW_SORT_KEY;
      default:
         throw new Error('Invalid valueName: ' + valueName);
   }
}