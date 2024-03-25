import {
   AuthResponse,
   RegisterRequest,
   LoginRequest,
   UserRequest,
   UserCountResponse,
   FollowResponse,
   IsFollowerRequest,
   IsFollowerResponse,
   LoadMoreItemsRequest,
   Status,
   User,
   LoadMoreItemsResponse
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {

   private SERVER_URL = "https://7u1ptwdfjb.execute-api.us-east-2.amazonaws.com/beta"; // TODO: Set this value.

   private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

   async login(request: LoginRequest): Promise<AuthResponse> {
      const endpoint = "/service/login";
      const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(request, endpoint);

      return AuthResponse.fromJson(response);
   }

   async register(request: RegisterRequest): Promise<AuthResponse> {
      const endpoint = "/service/register";
      const response: JSON = await this.clientCommunicator.doPost<RegisterRequest>(request, endpoint);

      return AuthResponse.fromJson(response);
   }

   async loadMoreFollowers(request: LoadMoreItemsRequest<User>): Promise<LoadMoreItemsResponse<User>> {
      const endpoint = "/get/followers";
      const response: JSON = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>>(request, endpoint);

      return LoadMoreItemsResponse.usersFromJson(response);
   }

   async loadMoreFollowees(request: LoadMoreItemsRequest<User>): Promise<LoadMoreItemsResponse<User>> {
      const endpoint = "/get/followees";
      const response: JSON = await this.clientCommunicator.doPost<LoadMoreItemsRequest<User>>(request, endpoint);

      return LoadMoreItemsResponse.usersFromJson(response);
   }

   async getIsFollowerStatus(request: IsFollowerRequest): Promise<IsFollowerResponse> {
      const endpoint = "/get/isfollower";
      const response: JSON = await this.clientCommunicator.doPost<UserRequest>(request, endpoint);

      return IsFollowerResponse.fromJson(response);
   }

   async getFolloweesCount(request: UserRequest): Promise<UserCountResponse> {
      const endpoint = "/get/followeescount";
      const response: JSON = await this.clientCommunicator.doPost<UserRequest>(request, endpoint);

      return UserCountResponse.fromJson(response);
   }

   async getFollowersCount(request: UserRequest): Promise<UserCountResponse> {
      const endpoint = "/get/followerscount";
      const response: JSON = await this.clientCommunicator.doPost<UserRequest>(request, endpoint);

      return UserCountResponse.fromJson(response);
   }

   async follow(request: UserRequest): Promise<FollowResponse> {
      const endpoint = "/service/follow";
      const response: JSON = await this.clientCommunicator.doPost<UserRequest>(request, endpoint);

      return FollowResponse.fromJson(response);
   }

   async unfollow(request: UserRequest): Promise<FollowResponse> {
      const endpoint = "/service/unfollow";
      const response: JSON = await this.clientCommunicator.doPost<UserRequest>(request, endpoint);

      return FollowResponse.fromJson(response);
   }
}