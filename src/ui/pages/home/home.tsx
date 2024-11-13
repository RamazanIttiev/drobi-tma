import { Page } from "@/ui/organisms/page/page.tsx";
import { Card } from "@/ui/molecules/card/card.tsx";
import { Link } from "@/ui/atoms/link/link.tsx";
import { Course } from "@/ui/pages/course/course.model.ts";
import { useLoaderData } from "react-router-dom";

import "./home.css";

export const HomeComponent = () => {
  const courses = useLoaderData() as Course[];

  return (
    <Page back={false}>
      <div className="home">
        {courses.map(({ id, title, image, shortDescription }) => (
          <Link to={`subject/${id}`} state={id} key={id}>
            <Card
              title={title}
              image={image}
              subtitle={shortDescription}
              className="home--card"
            />
          </Link>
        ))}
      </div>
    </Page>
  );
};
