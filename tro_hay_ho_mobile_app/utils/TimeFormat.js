import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi'; 

dayjs.extend(relativeTime);
dayjs.locale('vi'); 

export const formatTimeAgo = (dateString) => {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffInDays = now.diff(date, 'day');

  // duoi 7 ngay thi se hien ngay gio day du hehe
  if (diffInDays < 7) {
    return date.fromNow(); 
  }
  
  return date.format('DD-MM-YYYY');
};

export const formatDate=(dateString)=>{
  const date = dayjs(dateString);
  const formattedDate = date.format('DD-MM-YYYY');
  return formattedDate;
}