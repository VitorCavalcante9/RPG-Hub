import { User } from "../models/User";
import { Image } from "../models/Image";

interface Icon {
  name: string,
  key: string,
  url: string
}

export default{
  render(user: User){
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      icon: user.icon?.url ? user.icon?.url : ''
    }
  },
  minRender(username: string, icon: Icon){
    return {
      username,
      icon: icon?.url ? icon.url : ''
    }
  },
  authRender(user: User, token: string){
    return {
      id: user.id,
      username: user.username,
      icon: user.icon?.url ? user.icon?.url : '',
      token
    }
  }
}