import { PermissionChange } from "../models/PermissionChange";

export default{
  render(permissionChange: PermissionChange){
    let user_id: any = null;
    let username: any = null;

    if(permissionChange.character.participant){
      user_id = permissionChange.character.participant.user_id;
      username = permissionChange.character.participant.user.username;
    }

    return{
      id: permissionChange.id,
      permission: permissionChange.permission,
      user: {
        id: user_id,
        username,
      },
      character: {
        id: permissionChange.character_id,
        name: permissionChange.character.name,
      }
    }
  },
  renderMany(permissionsChange: PermissionChange[]){
    return permissionsChange.map(permissionChange => this.render(permissionChange));
  }
}