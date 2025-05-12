import Image from 'react-bootstrap/Image';

import { Container } from 'src/components/Container';

import '../index.css';

interface IPortfolioItem {
  id: number;
  title: string;
  content: string;
  url: string;
  align?: boolean;
}

const PortfolioItem: React.FC<IPortfolioItem> = ({ id, title, content, url }) => {
  return (
    <div className="row gap-1" style={{ alignItems: 'center' }}>
      <div className="d-flex col-md-8 col-12">
        <div className="item-number align-self-center">{id}</div>
        <div className="portfolio-content ms-5">
          <div className="title">{title}</div>
          <div className="content mt-1">{content}</div>
        </div>
      </div>
      <Container width="fit-content" margin="0 auto">
        <Image src={url} width="100%" style={{ maxHeight: '6rem', maxWidth: '6.5rem' }} />
      </Container>
    </div>
  );
};

export default PortfolioItem;
