import { ObjectItem } from "../models/Object";

export default{
  render(objectItem: ObjectItem){
    return{
      id: objectItem.id,
      name: objectItem.name,
      image: objectItem.image?.url ? objectItem.image?.url : ''
    }
  },
  renderMany(objectItems: ObjectItem[]){
    return objectItems.map(objectItem => this.render(objectItem));
  }
}