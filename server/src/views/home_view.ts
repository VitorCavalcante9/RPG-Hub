import { User } from "../models/User";

export default{
  render(user: User){
    const rpgs_content = user.rpgs.map(rpg => {
      return {
        id: rpg.id,
        name: rpg.name,
        icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${rpg.icon}`
      }
    })

    const rpgs_participant_content = user.rpgs_participant.map(rpg_participant => {
      const { id, name, icon } = rpg_participant.rpg;
      return {
        id, 
        name, 
        icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${icon}`
      }
    })

    return{
      rpgs: rpgs_content,
      partipating_rpgs: rpgs_participant_content
    }
  }
}