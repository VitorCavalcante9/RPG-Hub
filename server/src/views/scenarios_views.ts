import { Scenario } from "../models/Scenario";

export default{
  render(scenario: Scenario){
    return{
      id: scenario.id,
      name: scenario.name,
      image: scenario.image?.url ? scenario.image?.url : ''
    }
  },
  renderMany(scenarios: Scenario[]){
    return scenarios.map(scenario => this.render(scenario));
  }
}