import type { FC } from "react";

import { Page } from "@/ui/organisms/page/page.tsx";
import { Card } from "@/ui/molecules/card/card.tsx";
import { Link } from "@/ui/atoms/link/link.tsx";

import { courses } from "@/mocks/courses.ts";

import "./home.css";

export const Home: FC = () => {
  return (
    <Page back={false}>
      <div className="home">
        {courses.map(({ title, image }) => (
          <Link to={`/${title}`}>
            <Card title={title} image={image} className="home--card" />
          </Link>
        ))}
      </div>
    </Page>
  );
};
