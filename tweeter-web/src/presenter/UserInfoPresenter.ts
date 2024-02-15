import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model-service/FollowService";

export interface UserInfoView {
   setIsFollower: (value: boolean) => void;
   setFolloweesCount: (value: number) => void;
   setFollowersCount: (value: number) => void;
   displayErrorMessage: (message: string) => void;
   displayInfoMessage: (message: string, duration: number) => void;
   clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {
   private service: FollowService;
   private view: UserInfoView;

   constructor(view: UserInfoView) {
      this.view = view;
      this.service = new FollowService();
   }

   public async setIsFollowerStatus(
      authToken: AuthToken,
      currentUser: User,
      user: User
   ) {
      try {
         if (currentUser === user) {
            this.view.setIsFollower(false);
         } else {
            this.view.setIsFollower(
               await this.service.getIsFollowerStatus(authToken, currentUser, user)
            );
         }
      } catch (error) {
         this.view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
         );
      }
   };

   public async setNumbFollowees(authToken: AuthToken, user: User) {
      try {
         this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, user));
      } catch (error) {
         this.view.displayErrorMessage(
            `Failed to get followees count because of exception: ${error}`
         );
      }
   };

   public async setNumbFollowers(authToken: AuthToken, user: User) {
      try {
         this.view.setFollowersCount(await this.service.getFollowersCount(authToken, user));
      } catch (error) {
         this.view.displayErrorMessage(
            `Failed to get followers count because of exception: ${error}`
         );
      }
   };

   public async followUser(user: User, authToken: AuthToken) {
      try {
         this.view.displayInfoMessage(`Adding ${user.name} to followers...`, 0);

         let [followersCount, followeesCount] = await this.service.follow(
            authToken,
            user
         );

         this.view.clearLastInfoMessage();

         this.view.setIsFollower(true);
         this.view.setFollowersCount(followersCount);
         this.view.setFolloweesCount(followeesCount);
      } catch (error) {
         this.view.displayErrorMessage(
            `Failed to follow user because of exception: ${error}`
         );
      }
   }

   public async unfollowUser(user: User, authToken: AuthToken) {
      try {
         this.view.displayInfoMessage(`Removing ${user.name} from followers...`, 0);

         let [followersCount, followeesCount] = await this.service.unfollow(
            authToken,
            user
         );

         this.view.clearLastInfoMessage();

         this.view.setIsFollower(false);
         this.view.setFollowersCount(followersCount);
         this.view.setFolloweesCount(followeesCount);
      } catch (error) {
         this.view.displayErrorMessage(
            `Failed to unfollow user because of exception: ${error}`
         );
      }
   }
}