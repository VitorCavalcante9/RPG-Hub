import { Rpg } from "../models/Rpg";

export default{
  render(rpg: Rpg){
    return{
      id: rpg.id,
      name: rpg.name,
      icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${rpg.icon}`
    }
  }
}