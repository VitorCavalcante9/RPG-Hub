
import styles from '../../styles/components/sessionItems/Message.module.css';

interface MessageProps{
  message: string;
  msgRef?: any;
}

export function Message({ message, msgRef }: MessageProps){
  return(
    <div className={styles.messageItem} ref={msgRef}>
      <p>{message}</p> 
    </div>
  );
}