import { Character } from "../models/Character";
import { Scenario } from "../models/Scenario";
import { ObjectItem } from "../models/Object";

export default{
  render(characters: Character[], scenarios: Scenario[], objects: ObjectItem[]){
    
    const formattedCharacters = characters.map(character => {
      return {
        id: character.id,
        name: character.name,
        icon: `http://${process.env.HOST}:${process.env.PORT}/uploads/${character.icon}`,
        inventory: character.inventory,
        status: character.status,
        skills: character.skills,
      }
    });

    const formattedScenarios = scenarios.map(scenario => {
      return {
        id: scenario.id,
        name: scenario.name,
        image: `http://${process.env.HOST}:${process.env.PORT}/uploads/${scenario.image}`
      }
    });

    const formattedObjects = objects.map(objectItem => {
      return {
        id: objectItem.id,
        name: objectItem.name,
        image: `http://${process.env.HOST}:${process.env.PORT}/uploads/${objectItem.image}`
      }
    })

    return{
      characters: formattedCharacters,
      scenarios: formattedScenarios,
      objects: formattedObjects,
    }
  }
}