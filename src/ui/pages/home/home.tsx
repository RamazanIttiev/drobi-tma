import { Page } from "@/ui/organisms/page/page.tsx";
import { Link } from "@/ui/atoms/link/link.tsx";

import { Avatar, Cell } from "@telegram-apps/telegram-ui";
import { courses } from "@/mocks/courses.ts";

import "./home.css";

export const HomePage = () => {
  return (
    <Page back={false}>
      <div className="home">
        {courses.map(({ id, title, image }) => (
          <Link to={`subject/${id}`} state={id} key={id}>
            <Cell
              before={<Avatar size={96} src={image} />}
              className={"home__cell"}
            >
              {title}
            </Cell>
          </Link>
        ))}
      </div>
    </Page>
  );
};
