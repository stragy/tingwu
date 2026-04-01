import { CreateUsersTable1710880000000 } from "./CreateUsersTable";
import { CreateUserProfilesTable1710880001000 } from "./CreateUserProfilesTable";
import { CreateAuthTokensTable1710880002000 } from "./CreateAuthTokensTable";

export const migrations = [
    CreateUsersTable1710880000000,
    CreateUserProfilesTable1710880001000,
    CreateAuthTokensTable1710880002000
];