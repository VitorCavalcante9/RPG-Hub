import { Notes } from "../models/Notes";

export default{
  render(note: Notes){
    return{
      id: note.id,
      notes: note.notes
    }
  }
}