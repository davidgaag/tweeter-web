import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter, } from "./Presenter";

export interface UserInfoView extends MessageView {
   setIsFollower: (value: boolean) => void;
   setFolloweesCount: (value: number) => void;
   setFollowersCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
   private service: FollowService;

   constructor(view: UserInfoView) {
      super(view);
      this.service = new FollowService();
   }

   public async setIsFollowerStatus(
      authToken: AuthToken,
      currentUser: User,
      user: User
   ) {
      this.doFailureReportingOperation(async () => {
         if (currentUser === user) {
            this.view.setIsFollower(false);
         } else {
            this.view.setIsFollower(
               await this.service.getIsFollowerStatus(authToken, user)
            );
         }
      }, "determine follower status");
   };

   public async setNumbFollowees(authToken: AuthToken, user: User) {
      this.doFailureReportingOperation(async () => this.view.setFolloweesCount(await this.service.getFolloweesCount(authToken, user)), "get followees count"); // TODO: string correct?
   };

   public async setNumbFollowers(authToken: AuthToken, user: User) {
      this.doFailureReportingOperation(async () => this.view.setFollowersCount(await this.service.getFollowersCount(authToken, user)), "get followers count"); // TODO: string correct?
   };

   public async followUser(user: User, authToken: AuthToken) {
      this.doFailureReportingOperation(async () => {
         this.view.displayInfoMessage(`Adding ${user.name} to followers...`, 0);

         let [followersCount, followeesCount] = await this.service.follow(
            authToken,
            user
         );

         this.view.clearLastInfoMessage();

         this.view.setIsFollower(true);
         this.view.setFollowersCount(followersCount);
         this.view.setFolloweesCount(followeesCount);
      }, "follow user");
   }

   public async unfollowUser(user: User, authToken: AuthToken) {
      this.doFailureReportingOperation(async () => {
         this.view.displayInfoMessage(`Removing ${user.name} from followers...`, 0);

         let [followersCount, followeesCount] = await this.service.unfollow(
            authToken,
            user
         );

         this.view.clearLastInfoMessage();

         this.view.setIsFollower(false);
         this.view.setFollowersCount(followersCount);
         this.view.setFolloweesCount(followeesCount);
      }, "unfollow user");
   }
}