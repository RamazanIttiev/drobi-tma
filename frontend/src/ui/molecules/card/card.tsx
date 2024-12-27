import { CardCell } from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/components/CardCell/CardCell";
import { Card as TgCard } from "@telegram-apps/telegram-ui/dist/components/Blocks/Card/Card";

interface Props {
  title?: string;
  subtitle?: string;
  image?: string;
  className?: string;
}

export const Card = (props: Props) => {
  const { title, subtitle, image, className } = props;

  return (
    <TgCard className={className}>
      <img alt={title} src={image} />
      <CardCell readOnly subtitle={subtitle}>
        {title}
      </CardCell>
    </TgCard>
  );
};
