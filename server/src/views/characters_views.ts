import { Character } from "../models/Character";

export default{
  render(character: Character){
    let user_id:any = null;
    let username:any = null;

    if(character.participant){
      user_id = character.participant.user.id,
      username = character.participant.user.username
    }

    return{
      id: character.id,
      name: character.name,
      icon: character.icon?.url ? character.icon?.url : '',
      inventory: character.inventory,
      status: character.status,
      skills: character.skills,
      limitOfPoints: character.limitOfPoints,
      user: {
        id: user_id,
        username
      }
    }
  },
  renderMany(characters: Character[]){
    return characters.map(character => this.render(character));
  }
}