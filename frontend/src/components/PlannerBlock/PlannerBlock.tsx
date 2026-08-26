import "./PlannerBlock.css";

interface PlannerBlockProps {
  blockType: string;
  users: string[];
  descript?: string | null;
}

const typeMeta = {
  lifehack: {
    title: "Лайфхаки",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 2.5c-2.9 0-5.25 2.35-5.25 5.25 0 1.9 1 3.55 2.5 4.5.4.25.65.7.65 1.18v.32h4.2v-.32c0-.48.25-.93.65-1.18 1.5-.95 2.5-2.6 2.5-4.5C15.25 4.85 12.9 2.5 10 2.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.1 16.2h3.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8.6 17.5h2.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  code_review: {
    title: "Код-ревью",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 7L2 10L6 13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 7L18 10L14 13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 4L8 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  extra: {
    title: "Дополнительно",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="10" r="2" fill="currentColor" />
        <circle cx="10" cy="10" r="2" fill="currentColor" />
        <circle cx="16" cy="10" r="2" fill="currentColor" />
      </svg>
    ),
  },
};

function PlannerBlock({ blockType, users, descript }: PlannerBlockProps) {
  const meta = typeMeta[blockType as keyof typeof typeMeta];

  if (!meta) {
    return <div className="block-card">Неизвестный тип блока: {blockType}</div>;
  }

  return (
    <div className="block-card">
      <span className="icon-badge">{meta.icon}</span>
      <span>{meta.title}</span>
      <span>{users.join(", ")}</span>
      {descript && <span>{descript}</span>}
    </div>
  );
}

export default PlannerBlock;