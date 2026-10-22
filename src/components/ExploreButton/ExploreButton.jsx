import './ExploreButton.css';

export default function ExploreButton({ children = 'Explore futures', type = 'submit', ...props }) {
  return (
    <button type={type} className="explore-button" {...props}>
      <span className="explore-button__shine" aria-hidden="true" />
      <span className="explore-button__label">{children}</span>
      <svg className="explore-button__icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path
          d="M3 14.5V9.5M3 9.5C3 6 7 6 7 3.5M3 9.5C3 6.5 9.5 7 15 7M12 4l3 3-3 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
