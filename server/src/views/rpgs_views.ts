import { Rpg } from "../models/Rpg";

export default{
  render(rpg: Rpg){
    return{
      id: rpg.id,
      name: rpg.name,
      icon: rpg.icon?.url ? rpg.icon?.url : ''
    }
  }
}