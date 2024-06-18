import { SetStateAction, useState} from 'react';
import Carousel from 'react-bootstrap/Carousel';

import tinaPic from '../assets/tina.jpg';

function HeaderCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: SetStateAction<number>) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
                <img src={tinaPic}
                    style={{ width: '100vw', aspectRatio: '16/3' }}
                />
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                Test2
                {/*<ExampleCarouselImage text="Second slide" />*/}
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                Test3
                {/*<ExampleCarouselImage text="Third slide" />*/}
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default HeaderCarousel;