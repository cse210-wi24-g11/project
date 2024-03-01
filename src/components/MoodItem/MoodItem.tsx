interface MoodListItemProps {
  imageUrl: string;
  title: string;
  date: Date;
  recordId: string;
  onClick: (recordId: string) => void;
}

const MoodListItem = (props: MoodListItemProps) => {
  const { imageUrl, title, date, recordId, onClick } = props;

  return (
    <div className="mood-list-item" onClick={() => onClick(recordId)}>
      <p className="title">{title}</p>
    </div>
  )
}

export default MoodListItem;
