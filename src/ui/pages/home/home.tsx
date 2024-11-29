import { Page } from "@/ui/organisms/page/page.tsx";
import { Link } from "@/ui/atoms/link/link.tsx";
import { Course } from "@/ui/pages/course/course.model.ts";
import { useLoaderData } from "react-router-dom";

import { Avatar, Cell } from "@telegram-apps/telegram-ui";

import "./home.css";

export const HomePage = () => {
  const courses = useLoaderData() as Course[];

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
