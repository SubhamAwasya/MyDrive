import { FaFolder } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

function Breadcrumb({ breadcrumbs = [], setBreadcrumbs }) {
  const navigate = useNavigate();
  const maxVisible = 5;

  // Ensure Home is always the first item
  const fullBreadcrumbs = breadcrumbs.length
    ? breadcrumbs
    : [{ folderName: "Home", folderId: "/" }];

  const getVisibleBreadcrumbs = () => {
    if (fullBreadcrumbs.length <= maxVisible) return fullBreadcrumbs;

    const first = fullBreadcrumbs[0];
    const lastFew = fullBreadcrumbs.slice(-2);

    return [first, { folderName: "...", isEllipsis: true }, ...lastFew];
  };

  const visibleCrumbs = getVisibleBreadcrumbs();

  const handleCrumbClick = (crumb) => {
    if (crumb.isEllipsis) return;

    const index = fullBreadcrumbs.findIndex(
      (b) => b.folderId === crumb.folderId && b.folderName === crumb.folderName
    );

    if (index !== -1) {
      const newPath = fullBreadcrumbs.slice(0, index + 1);
      setBreadcrumbs(newPath);
      navigate(`/folder/${crumb.folderId}`);
    }
  };

  return (
    <div className="breadcrumbs w-full text-sm overflow-x-auto whitespace-nowrap px-2">
      <ul className="flex items-center gap-2">
        {visibleCrumbs.map((crumb, index) => (
          <li
            key={index}
            onClick={() => handleCrumbClick(crumb)}
            className={`flex items-center gap-1 ${
              crumb.isEllipsis ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <FaFolder className="text-base" />

            <span
              className={
                crumb.isEllipsis
                  ? "pointer-events-none text-gray-400"
                  : "truncate"
              }
            >
              {crumb.folderName}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
