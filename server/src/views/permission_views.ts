import { PermissionChange } from "../models/PermissionChange";

export default{
  render(permissionChange: PermissionChange){
    return{
      id: permissionChange.id,
      permission: permissionChange.permission,
      user: {
        id: permissionChange.character.participant.user_id,
        username: permissionChange.character.participant.user.username,
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